import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void //void==vazio (ou seja a funcao não tem retorno)
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
const speechRecognition = new SpeechRecognitionAPI();

export const NewNoteCard = ({ onNoteCreated }: NewNoteCardProps) => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const handleStartEditor = () => {
    setShouldShowOnboarding(false)
  }

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    e.target.value === '' ? setShouldShowOnboarding(true) : ''
  }

  const handleSalveNote = (e: FormEvent) => {
    e.preventDefault()
    if (content == '') return
    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)
    toast.success('Nota criada com sucesso!')
  }

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvaialable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvaialable) {
      alert('Infelizmente  seu navegador não suporta a API de gravação!')
      return
    }
    setIsRecording(true)
    setShouldShowOnboarding(false)


    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (e) => {
      console.log(e.results)
      const transciption = Array.from(e.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transciption)
    }

    speechRecognition.onerror = (e) => {
      console.error(e)
    }

    speechRecognition.start()
  }
  const handleStoptRecording = () => {
    setIsRecording(false)
    
    if (speechRecognition !== null) {
      speechRecognition.stop()
    }


  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col gap-3 text-left bg-slate-700 p-5  hover:border-2 hover:border-slate-600  focus-visible:border-2   focus:border-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className='size-5' />
          </Dialog.Close>
          <form className='flex-1 flex flex-col'>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Adicionar nota
              </span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece <button type='button' onClick={handleStartRecording} className="font-md text-lime-400  hover:underline">gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className="font-md text-lime-400  hover:underline">utilize apenas texto</button>.
                </p>
              ) : (
                <textarea autoFocus onChange={handleContentChange} value={content} className="
              text-sm eading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none
              "
                />
              )}
            </div>

            {isRecording ? (<button
              type='button'
              onClick={handleStoptRecording}
              className='flex  items-center justify-center gap-2 w-full bg-slate-900 py-4 text-ecnter text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
            >
              <div className="size-3 rounded-full bg-red-500 animate-pulse" />
              Gravando! (clique p/ interromper)</button>) : (<button
                onClick={handleSalveNote}
                type='button'
                className='w-full bg-lime-400 py-4 text-ecnter text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
              >Salvar nota</button>)}

          </form>
        </Dialog.Content>
      </Dialog.Portal>

    </Dialog.Root>
  )
}