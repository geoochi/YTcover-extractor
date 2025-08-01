"use client"

import type React from "react"

import { useState } from "react"

export default function YouTubeThumbnailExtractor() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<{
    type: "loading" | "success" | "error"
    content?: string
    videoId?: string
  } | null>(null)

  // 提取 YouTube 视频 ID 的函数
  function extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // 直接输入视频 ID
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  // 处理输入
  function handleSubmit() {
    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setResult(null)
      return
    }

    // 显示加载状态
    setResult({ type: "loading" })

    // 延迟一点时间以显示加载效果
    setTimeout(() => {
      const videoId = extractVideoId(trimmedUrl)

      if (videoId) {
        setResult({
          type: "success",
          videoId: videoId,
        })
      } else {
        setResult({
          type: "error",
          content: "无法提取视频 ID，请检查 URL 格式是否正确",
        })
      }
    }, 300)
  }

  // 监听回车键
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          <span className="text-red-500 mr-3">▶</span>
          YouTube 缩略图提取器
        </h1>

        <div className="mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入 YouTube URL (例如: https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            className="w-full p-4 border-2 border-gray-200 rounded-full text-lg outline-none focus:border-blue-500 focus:bg-white bg-gray-50 transition-all duration-300"
            autoComplete="off"
          />
          <div className="text-gray-500 text-sm mt-3">输入 YouTube 视频链接并按回车键提取缩略图</div>
        </div>

        <div className="min-h-[200px] flex items-center justify-center">
          {result?.type === "loading" && <div className="text-gray-500 italic">正在加载缩略图...</div>}

          {result?.type === "error" && (
            <div className="text-red-600 bg-red-50 border border-red-200 px-6 py-4 rounded-xl font-medium">
              {result.content}
            </div>
          )}

          {result?.type === "success" && result.videoId && (
            <div>
              <div className="inline-block rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300">
                <img
                  src={`https://img.youtube.com/vi/${result.videoId}/maxresdefault.jpg`}
                  alt="YouTube 视频缩略图"
                  className="max-w-full h-auto block"
                  onError={(e) => {
                    // 如果高质量缩略图加载失败，使用标准质量
                    const target = e.target as HTMLImageElement
                    target.src = `https://img.youtube.com/vi/${result.videoId}/hqdefault.jpg`
                  }}
                />
              </div>
              <div className="mt-4 px-6 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-600 font-mono text-sm">
                视频 ID: {result.videoId}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
