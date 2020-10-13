import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react'
import Loader from 'react-loader-spinner'

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
  const isAdmin = userContext?.user?.userGroupType === 'admin'

  const { loading, error, response, get, post, put, del } = useFetch<
    APIResponse<IChapter[]>
  >('/pds-handbook', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const loadChapters = useCallback(async () => {
    const chaptersResponse = (await get()) as APIResponse<IChapter[]>
    if (chaptersResponse.success) {
      setChapters(chaptersResponse.data)
      extractTitles(chaptersResponse.data)
    }
  }, [get])

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
  }, [loadChapters])

  const menuRef = useRef(null)

  useClickOutside(menuRef, () => setNavigate(false))

  const save = async () => {
    setEdit(false)
    await put(
      `/${chapters[currentChapter]?.chapterId}`,
      chapters[currentChapter]
    )
    if (response.ok) {
      await loadChapters()
      extractTitles(chapters)
    }
  }

  const addChapter = async () => {
    const newChapterID = chapters[chapters.length - 1]?.chapterId + 1
    const newChapter: IChapter = {
      chapterId: newChapterID,
      text: '<h1>New Chapter</h1>',
      editedBy: userContext?.user?.username,
    }
    await post(newChapter)
    if (response.ok) {
      await loadChapters()
      extractTitles(chapters)
      changeChapter(chapters.length)
      setEdit(true)
    }
  }
  const handleRTEValueChanged = (value: string) => {
    const chaptersCopy = chapters
    chaptersCopy.splice(currentChapter, 1, {
      ...chapters[currentChapter],
      text: value,
    })
    setChapters(chaptersCopy)
  }

  const deleteChapter = async () => {
    if (edit) {
      setEdit(false)
    }
    await del(`/${chapters[currentChapter].chapterId}`)
    if (response.ok) {
      await loadChapters()
      const nextChapter = currentChapter - 1
      if (currentChapter >= 0) {
        setCurrentChapter(nextChapter)
      } else {
        setCurrentChapter(0)
      }
    }
  }

  const changeChapter = (index: number) => {
    setCurrentChapter(index)
    setNavigate(false)
  }

  return (
    <div>
      <div className={styles.controls}>
        <IconButton onClick={() => setNavigate(true)} icon="menu" />
        <div>
          <span className={styles.error}>
            {error
              ? "Hmm, that didn't go according to plan. Try again later!"
              : ''}
          </span>
          <Loader height={24} color="grey" type="Grid" visible={loading} />
          {isAdmin ? (
            <>
              {edit ? (
                <IconButton onClick={save} icon="save" />
              ) : (
                <IconButton onClick={() => setEdit(true)} icon="create" />
              )}
              <IconButton onClick={() => deleteChapter()} icon="delete" />
            </>
          ) : null}
        </div>
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
                  onClick={addChapter}
                />
              ) : null}
            </>
          </RefSideMenu>
        </div>
      ) : null}
      <div className={styles.content}>
        {chapters.length === 0 && loading ? (
          <p>Loading ...</p>
        ) : edit ? (
          <RichEditor
            value={chapters[currentChapter]?.text || ''}
            onChanged={handleRTEValueChanged}
          />
        ) : (
          <>
            {chapters[currentChapter]
              ? parse(
                  chapters[currentChapter]?.text ||
                    "Oups! Looks like there's no content here yet."
                )
              : null}
          </>
        )}
      </div>
    </div>
  )
}
