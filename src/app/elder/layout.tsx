import { VoiceAssistant } from "@/components/VoiceAssistant"

export default function ElderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <VoiceAssistant />
    </>
  )
}
