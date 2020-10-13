import React, { useState, useEffect, useRef, useContext } from 'react'

import parse from 'html-react-parser'

import { RichEditor } from '../../components/rich-editor'
import { RefSideMenu } from '../../components/side-menu'
import { IconButton } from '../../components/icon-button'
import { MenuButton } from '../../components/menu-button'

import { useClickOutside } from '../../utils/hooks/useClickOutside'

import styles from './Read.module.css'
import { UserContext } from '../../utils/context/userContext'
import useFetch, { CachePolicies } from 'use-http'
import { APIResponse } from '../../models/api-response'
import { IChapter } from '../../models/chapter'

export const Read: React.FC = () => {
  const [currentChapter, setCurrentChapter] = useState<number>(0)
  const [edit, setEdit] = useState<boolean>(false)
  const [navigate, setNavigate] = useState<boolean>(false)
  const [chapters, setChapters] = useState<IChapter[]>([])
  const [chapterTitles, setChapterTitles] = useState<string[]>([])

  const userContext = useContext(UserContext)
  // const isAdmin = userContext?.user?.userGroupId === 'admin'
  const isAdmin = true

  const { loading, error, response, get, post, put } = useFetch<
    APIResponse<IChapter[]>
  >('/pds-handbook', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const loadChapters = async () => {
    const chaptersResponse = (await get()) as APIResponse<IChapter[]>
    if (response.ok) {
      setChapters(chaptersResponse.data)
      extractTitles(chaptersResponse.data)
    }
  }

  const extractTitles = (chaptersData: IChapter[]) => {
    const titles: string[] = []
    const parser = new DOMParser()
    for (const chapter of chaptersData) {
      let title: string
      const parsedText = parser.parseFromString(chapter.text, 'text/html')
      const headings = parsedText.getElementsByTagName('h1')
      if (headings.length > 0) title = headings[0].textContent as string
      else {
        title = parsedText.getElementsByTagName('body')[0].textContent as string
      }
      if (title) titles.push(title)
    }
    setChapterTitles(titles)
  }

  useEffect(() => {
    loadChapters()
  }, [])

  const menuRef = useRef(null)

  useClickOutside(menuRef, () => setNavigate(false))

  const save = async () => {
    setEdit(false)
    await put(
      `/${chapters[currentChapter].chapterId}`,
      chapters[currentChapter]
    )
    if (response.ok) {
      await loadChapters()
      extractTitles(chapters)
    }
  }

  const addChapter = async () => {
    const newChapter: IChapter = {
      chapterId: chapters.length + 1,
      text: ' ',
      editedBy: userContext?.user?.username,
    }
    await post(newChapter)
    if (response.ok) {
      await loadChapters()
      extractTitles(chapters)
      changeChapter(chapters.length - 1)
      setEdit(true)
    }
  }

  const deleteChapter = () => {
    console.log('Click!')
  }

  const changeChapter = (index: number) => {
    setCurrentChapter(index)
    setNavigate(false)
  }

  return (
    <div>
      <div className={styles.controls}>
        {!navigate ? (
          <IconButton onClick={() => setNavigate(true)} icon="menu" />
        ) : null}
        {isAdmin ? (
          <div>
            {edit ? (
              <IconButton onClick={save} icon="save" />
            ) : (
              <IconButton onClick={() => setEdit(true)} icon="create" />
            )}
            <IconButton onClick={() => deleteChapter()} icon="delete" />
          </div>
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
                  onClick={() => addChapter()}
                />
              ) : null}
            </>
          </RefSideMenu>
        </div>
      ) : null}
      <div className={styles.content}>
        {chapters === [] && loading ? (
          <p>Loading ...</p>
        ) : edit ? (
          <RichEditor
            value={chapters[currentChapter]?.text || ''}
            onChanged={(value) => {
              const chaptersCopy = chapters
              chaptersCopy.splice(currentChapter, 1, {
                ...chapters[currentChapter],
                text: value,
              })
              setChapters(chaptersCopy)
            }}
          />
        ) : (
          <>
            {parse(
              chapters[currentChapter]?.text ||
                "Oups! Looks like there's no content here yet."
            )}
          </>
        )}
      </div>
    </div>
  )
}
