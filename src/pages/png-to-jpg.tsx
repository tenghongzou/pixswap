import PairPage from '@/components/PairPage'
import { JPG, PNG } from '@/lib/formats'

export default function PngToJpgPage() {
  return <PairPage from={PNG} to={JPG} />
}
