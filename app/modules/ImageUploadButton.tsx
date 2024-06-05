'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { imageSizeLimition } from '@/app/shared/constants'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { fetchUploadImage } from '@/app/shared/fetches'

const ImageUploadButton = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [alertText, setAlertText] = useState('')

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const fileInput = inputRef.current as HTMLInputElement
            // 检查文件类型
            if (!['image/png', 'image/jpeg'].includes(file.type)) {
                setAlertText(`Accepted formats: PNG, JPEG.`)
                fileInput.value = ''
                return
            }

            // 检查文件大小
            if (file.size > imageSizeLimition) {
                setAlertText(`Max image size: ${imageSizeLimition / 1000000}MB`)
                fileInput.value = ''
                return
            }

            // const formData = new FormData();
            // formData.append('file', file);
            const blob = new Blob([file], { type: file.type })
            helperUploadImage(blob)
        }
    }

    return (
        <div
            className="svg-image flex h-10 w-10 overflow-hidden items-center justify-center cursor-pointer bg-lightGreen rounded-full"
            onClick={handleClick}
        >
            <img src={'/images/icons/attachment.svg'} className="h-6 w-6 " />
            <input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileUpload}
                ref={inputRef}
                style={{ display: 'none' }}
            />
            <OverSizeAlert
                content={alertText}
                callback={() => {
                    setAlertText('')
                }}
            />
        </div>
    )
}

export default ImageUploadButton

const OverSizeAlert = ({ title, content, callback }: { title?: string; content?: string; callback: () => void }) => {
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (content) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [content])

    const handleClose = () => {
        callback()
    }
    return (
        <AlertDialog open={open}>
            <AlertDialogContent onEscapeKeyDown={handleClose}>
                <AlertDialogHeader>
                    {title ? <AlertDialogTitle>{title}</AlertDialogTitle> : null}

                    <AlertDialogDescription className="text-lg font-bold">{content}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleClose}>OK</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const helperUploadImage = async (imageBlob: Blob) => {
    const result = await fetchUploadImage(imageBlob)

    console.log(`helperUploadImage`, result)
}