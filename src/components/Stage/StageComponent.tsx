import { useEffect, useState } from 'react'
import { useStage } from 'hooks/useStage'
import { useSessions } from 'hooks/useSessions'
import { Player } from 'components/Player'
import { PageContainer } from 'components/Container'
import SessionInfoBox from 'components/Session/Infobox'
import SpeakerModalBox from 'components/Speaker/ModalBox'
import SessionList from 'components/Session/List'
import Modal from '../Modal'
import { ShareBox } from '../Share/Box'
import { Speaker } from 'types'
import Embed from 'components/Embed'

export function StageComponent() {
  const currentStage = useStage()
  const {  sessions, addOrUpdateFilter } = useSessions()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<string | null>(null)
  const [speaker, setSpeaker] = useState<Speaker | undefined>(undefined)

  useEffect(() => {
    addOrUpdateFilter({ type: 'stage', value: currentStage.id })
    addOrUpdateFilter({ type: 'day', value: 'today' })

  }, [currentStage])
    

  const currentSession = sessions[0]

  const openModal = (type: 'share' | 'speaker' | 'embed', speaker?: Speaker) => {
    setModalContentType(type)
    setSpeaker(speaker)
    setModalOpen(true)
  }

  const modalContent = () => {
    if (modalContentType === 'share') {
      return <ShareBox title={currentSession.name} />
    } else if (modalContentType === 'speaker') {
      return <SpeakerModalBox speaker={speaker} />
    } else if (modalContentType === 'embed') {
      return <Embed stageId={currentStage.id} />
    }
    return null
  }

  return (
    <div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent()}
      </Modal>
      <PageContainer>
        <div className="flex flex-col lg:flex-row md:h-full overflow-hidden">
          <div className="flex flex-col w-full bg-gray-300">
            <Player stream={currentStage.stream} />
            <div className="mt-auto">
              <div>
                <SessionInfoBox
                  session={currentSession}
                  onShareClick={() => openModal('share')}
                  onSpeakerClick={(speaker) => openModal('speaker', speaker)}
                  onEmbedClick={() => openModal('embed')}
                />
              </div>
            </div>
          </div>
          <div className="lg:w-1/4 p-3 lg:p-5 box-border flex flex-col overflow-auto lg:mt-0 h-full">
            {/* <h3 className="text-2xl font-bold dark:text-white flex mb-3">Schedule</h3> */}
            <div className="flex flex-col w-full overflow-y-auto h-full">
              <SessionList  sessions={sessions} currentSession={currentSession} isLive={false} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
