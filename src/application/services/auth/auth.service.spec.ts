vi.mock("bcrypt", async () => {
  const actualBcrypt = await vi.importActual<typeof import("bcrypt")>("bcrypt")
  return {
    ...actualBcrypt,
    hash: vi.fn().mockResolvedValue("hashedPassword"),
    compare: vi.fn().mockResolvedValue(true)
  }
})

import { describe, it, expect, beforeEach, vi } from "vitest"
import { ConflictException, UnauthorizedException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { faker } from "@faker-js/faker"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import AuthService from "./auth.service"
import UserRepository from "src/domain/repositories/user.repository"
import UserRole from "src/domain/enums/user-role.enum"
import AuthController from "src/api/http/controllers/auth/auth.controller"
import MailService from "src/infrastructure/mail/mail.service"
import type { Mock } from "vitest"
import { Collection } from "@mikro-orm/postgresql"
import Booking from "src/domain/entities/booking.entity"
import Transaction from "src/domain/entities/transaction.entity"
import Review from "src/domain/entities/review.entity"

const dummyUser = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  password: "hashedPassword",
  isVerified: false,
  role: UserRole.USER,
  createdAt: new Date(),
  googleId: undefined,
  profile: undefined,
  bookings: {} as unknown,
  transactions: {} as unknown,
  reviews: {} as unknown
} as const

describe("Auth Integration Tests", () => {
  let authController: AuthController
  let authService: AuthService
  let mailService: MailService
  let userRepository: {
    findUserEmail: Mock<(email: string) => Promise<ReturnType<UserRepository["findUserEmail"]>>>
    findUserId: Mock<(id: string) => Promise<ReturnType<UserRepository["findUserId"]>>>
    createUser: Mock<
      (
        name: string,
        email: string,
        password: string,
        isVerified: boolean,
        role: UserRole
      ) => Promise<ReturnType<UserRepository["createUser"]>>
    >
    persistAndFlush: Mock<(data: object) => Promise<void>>
  }
  let jwtService: {
    signAsync: Mock<(payload: object, options?: object) => Promise<string>>
    verifyAsync: Mock<(token: string) => Promise<object>>
    sign: Mock<(payload: object, options?: object) => string>
    verify: Mock<(token: string) => object>
  }

  const mockUser = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    email: "test@example.com",
    password: "hashedPassword",
    isVerified: false,
    role: UserRole.USER,
    createdAt: new Date(),
    googleId: undefined,
    profile: undefined,
    bookings: {} as Collection<Booking>, // Mock Collection
    transactions: {} as Collection<Transaction>, // Mock Collection
    reviews: {} as Collection<Review> // Mock Collection
  }

  mockUser.bookings = new Collection<Booking>(mockUser)
  mockUser.transactions = new Collection<Transaction>(mockUser)
  mockUser.reviews = new Collection<Review>(mockUser)

  beforeEach(async () => {
    jwtService = {
      signAsync: vi.fn().mockResolvedValue("mock.jwt.token"),
      verifyAsync: vi.fn(),
      sign: vi.fn().mockReturnValue("mock.verification.token"),
      verify: vi.fn()
    }

    userRepository = {
      findUserEmail: vi.fn(),
      findUserId: vi.fn(),
      createUser: vi.fn(),
      persistAndFlush: vi.fn()
    }

    const mailServiceMock = {
      sendVerificationEmail: vi.fn().mockResolvedValue(undefined)
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: UserRepository, useValue: userRepository },
        { provide: MailService, useValue: mailServiceMock }
      ]
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
    mailService = module.get<MailService>(MailService)
  })

  describe("Registration Flow", () => {
    it("should successfully register user and send verification email", async () => {
      const registerDto = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123!"
      }

      userRepository.findUserEmail.mockResolvedValue(null)
      userRepository.createUser.mockResolvedValue(mockUser)

      const result = await authController.register(registerDto)

      expect(userRepository.findUserEmail).toHaveBeenCalledWith(registerDto.email)
      expect(userRepository.createUser).toHaveBeenCalledWith(
        registerDto.name,
        registerDto.email,
        "hashedPassword",
        false,
        UserRole.USER
      )
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        registerDto.email,
        expect.any(String)
      )
      expect(result).toEqual({
        message: "Registration successful. Please check your email to verify your account"
      })
    })

    it("should handle duplicate email registration", async () => {
      const registerDto = {
        name: "Test User",
        email: "existing@example.com",
        password: "Password123!"
      }
      userRepository.findUserEmail.mockResolvedValue(mockUser)

      await expect(authController.register(registerDto)).rejects.toThrow(ConflictException)
      expect(mailService.sendVerificationEmail).not.toHaveBeenCalled()
    })
  })

  describe("Authentication Flow", () => {
    it("should successfully authenticate user and return token", async () => {
      const loginDto = {
        email: "test@example.com",
        password: "Password123!"
      }
      userRepository.findUserEmail.mockResolvedValue(mockUser)

      const result = await authController.login(loginDto)

      expect(userRepository.findUserEmail).toHaveBeenCalledWith(loginDto.email)
      expect(jwtService.signAsync).toHaveBeenCalled()
      expect(result).toHaveProperty("access_token", "mock.jwt.token")
    })

    it("should handle invalid credentials", async () => {
      const loginDto = {
        email: "test@example.com",
        password: "WrongPassword"
      }
      userRepository.findUserEmail.mockResolvedValue(mockUser)
      ;(
        bcrypt.compare as Mock<(plain: string, hash: string) => Promise<boolean>>
      ).mockResolvedValue(false)

      const result = await authController.login(loginDto)
      expect(result).toEqual({ message: "Invalid credentials" })
    })
  })

  describe("Email Verification Flow", () => {
    it("should successfully verify email token", async () => {
      const mockToken = "valid.token"
      const mockPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        type: "emailVerification"
      }

      jwtService.verify.mockReturnValue(mockPayload)
      userRepository.findUserId.mockResolvedValue({ ...mockUser, isVerified: false })

      const result = await authController.verifyEmail(mockToken)

      expect(userRepository.findUserId).toHaveBeenCalledWith(mockPayload.sub)
      expect(userRepository.persistAndFlush).toHaveBeenCalledWith({ ...mockUser, isVerified: true })
      expect(result).toEqual({ message: "Email successfully verified" })
    })
  })

  describe("Token Refresh Flow", () => {
    it("should successfully refresh token", async () => {
      const mockToken = "valid.refresh.token"
      const mockPayload = {
        email: mockUser.email,
        sub: mockUser.id,
        roles: [UserRole.USER]
      }

      jwtService.verifyAsync.mockResolvedValue(mockPayload)

      const result = await authController.refresh(mockToken)
      expect(result).toHaveProperty("access_token", "mock.jwt.token")
      expect(jwtService.signAsync).toHaveBeenCalled()
    })

    it("should handle invalid refresh token", async () => {
      const mockToken = "invalid.token"
      jwtService.verifyAsync.mockRejectedValue(new Error("Invalid token"))

      await expect(authController.refresh(mockToken)).rejects.toThrow(UnauthorizedException)
    })
  })
})
