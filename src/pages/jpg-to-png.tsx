import ImageConverter, { JPG, PNG } from '@/components/ImageConverter'

export default function JpgToPngPage() {
  return <ImageConverter from={JPG} to={PNG} />
}
