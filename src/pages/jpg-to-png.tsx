import React, { useState } from 'react'
import { useRouter } from 'next/router'

const JpgToPngPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const router = useRouter()

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0])
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (selectedFile) {
            const formData = new FormData()
            formData.append('file', selectedFile)

            try {
                const response = await fetch('/api/jpg-to-png', {
                    method: 'POST',
                    body: formData,
                })

                if (response.ok) {
                    const { url } = await response.json()
                    router.push(url)
                } else {
                    console.error(`Failed to convert file: ${response.status}`)
                }
            } catch (error) {
                console.error(`Error converting file: ${error}`)
            }
        }
    }

    return (
        <div>
            <h1>JPG to PNG 轉換器</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="fileInput">選擇要轉換的 JPG 檔案：</label>
                <input
                    type="file"
                    id="fileInput"
                    accept="image/jpeg"
                    onChange={handleFileChange}
                />
                <button type="submit" disabled={!selectedFile}>
                    轉換為 PNG
                </button>
            </form>
        </div>
    )
}

export default JpgToPngPage
