import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

export const NewNoteCard = () => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')

  const handleStartEditor = () => {
    setShouldShowOnboarding(false)
  }

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    e.target.value === '' ? setShouldShowOnboarding(true) : ''
  }

  const handleSalveNote = (e: FormEvent) => {
    e.preventDefault()
    toast.success('Nota criada com sucesso!')

  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col gap-3 text-left bg-slate-700 p-5  hover:border-2 hover:border-slate-600  focus-visible:border-2   focus:border-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aliquid assumenda commodi ut nihil ducimus quae facere debitis autem ipsum. Praesentium eligendi nostrum dolorum ut commodi, fugiat perspiciatis possimus dolorem.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className='size-5' />
          </Dialog.Close>
          <form onSubmit={handleSalveNote} className='flex-1 flex flex-col'>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-200">
              Adicionar nota
            </span>
            {shouldShowOnboarding ? (
              <p className="text-sm leading-6 text-slate-400">
                Comece <button className="font-md text-lime-400  hover:underline">gravando uma nota</button> em áudio ou se preferir <button onClick={handleStartEditor} className="font-md text-lime-400  hover:underline">utilize apenas texto</button>.
              </p>
            ) : (
              <textarea autoFocus onChange={handleContentChange} className="
              text-sm eading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none
              "
              />
            )}
          </div>
          <button
            type='submit'
            className='w-full bg-lime-400 py-4 text-ecnter text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
          >Salvar nota</button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>

    </Dialog.Root>
  )
}