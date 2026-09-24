import ImageConverter, { JPG, PNG } from '@/components/ImageConverter'

export default function PngToJpgPage() {
  return <ImageConverter from={PNG} to={JPG} />
}
