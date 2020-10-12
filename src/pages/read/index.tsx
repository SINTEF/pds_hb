import React, { useState, useEffect, useRef, useContext } from 'react'

import parse from 'html-react-parser'

import { RichEditor } from '../../components/rich-editor'
import { RefSideMenu } from '../../components/side-menu'
import { IconButton } from '../../components/icon-button'
import { MenuButton } from '../../components/menu-button'

import { useClickOutside } from '../../utils/hooks/useClickOutside'

import styles from './Read.module.css'
import { UserContext } from '../../utils/context/userContext'

export const Read: React.FC = () => {
  const [currentValue, setCurrentValue] = useState<string>('')
  const [edit, setEdit] = useState<boolean>(false)
  const [navigate, setNavigate] = useState<boolean>(false)
  const [chapters, setChapters] = useState<string[]>([])
  const [chapterTitles, setChapterTitles] = useState<string[]>([])

  const userContext = useContext(UserContext)
  const isAdmin = userContext?.user?.userGroupId === 'admin'

  useEffect(() => {
    // Get data from server here
    // Extract titles from server data here also, by parsing the incoming HTML and looking for H1-tags
  }, [])

  useEffect(() => {
    if (chapters[0]) {
      setCurrentValue(chapters[0])
    }
  }, [chapters])

  const menuRef = useRef(null)

  useClickOutside(menuRef, () => setNavigate(false))

  const save: () => void = () => {
    setEdit(false)
    // TODO: Send value to server and refetch chapters to reflect changes.
  }

  const changeChapter: (index: number) => void = (index) => {
    setCurrentValue(chapters[index])
    setNavigate(false)
  }

  return (
    <>
      <div className={styles.controls}>
        {!navigate ? (
          <IconButton onClick={() => setNavigate(true)} icon="menu" />
        ) : null}
        {isAdmin ? (
          edit ? (
            <IconButton onClick={save} icon="save" />
          ) : (
            <IconButton onClick={() => setEdit(true)} icon="create" />
          )
        ) : null}
      </div>
      {navigate ? (
        <div className={styles.sideMenu}>
          <RefSideMenu ref={menuRef}>
            <>
              {chapterTitles.map((title, index) => (
                <MenuButton
                  label={title}
                  key={title}
                  onClick={() => changeChapter(index)}
                />
              ))}
              {isAdmin ? (
                <MenuButton
                  label="+ Add new chapter"
                  key="Add new chapter"
                  onClick={() => console.log('Click!')}
                />
              ) : null}
            </>
          </RefSideMenu>
        </div>
      ) : null}
      <div className={styles.content}>
        {edit ? (
          <RichEditor
            value={currentValue}
            onChanged={(value) => setCurrentValue(value)}
          />
        ) : (
          <>
            {parse(
              currentValue || "Oups! Looks like there's no content here yet."
            )}
          </>
        )}
      </div>
    </>
  )
}
