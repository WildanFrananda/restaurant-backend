import { Injectable } from "@nestjs/common"
import WsConfig from "src/common/config/ws-config.type"

type ProcessBinaryType = { type: string; data: Buffer }

@Injectable()
class WsBinary {
  constructor(private readonly config: WsConfig) {}

  public validateBinaryData(data: Buffer, mimeType: string): boolean {
    if (data.length > this.config.binaryOptions.maxSize) {
      throw new Error(
        `File size exceeds maximum allowed size of ${this.config.binaryOptions.maxSize} bytes`
      )
    }

    const isAllowedType = this.config.binaryOptions.allowedTypes.some((allowed) => {
      if (allowed.endsWith("/*")) {
        const prefix = allowed.slice(0, -2)

        return mimeType.startsWith(prefix)
      }
    })

    if (!isAllowedType) {
      throw new Error(`File type ${mimeType} is not allowed`)
    }

    return true
  }

  public processBinaryMessage(data: Buffer): ProcessBinaryType {
    const mimeTypeLength = data.readUint32BE(0)
    const mimeType = data.slice(4, 4 + mimeTypeLength).toString("utf-8")
    const binaryData = data.slice(4 + mimeTypeLength)

    this.validateBinaryData(binaryData, mimeType)

    return {
      type: mimeType,
      data: binaryData
    }
  }
}

export default WsBinary
