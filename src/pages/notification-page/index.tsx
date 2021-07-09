import styles from './NotificationPage.module.css'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useFetch, { CachePolicies } from 'use-http'
import MAIN_ROUTES from '../../routes/routes.constants'

import { Title } from '../../components/title'
import { APIResponse } from '../../models/api-response'
import { RegisteredDataField } from '../../components/registered-data-field'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import { INotification } from '../../models/notification'
import { ViewLongText } from '../../components/view-long-text'
import { Button } from '../../components/button'
import { Filter } from '../../components/filter'
import Loader from 'react-loader-spinner'
import { SearchField } from '../../components/search-field'
import { IComment } from '../../models/comment'
import { CommentSection } from '../../components/comment-section'
import { InputField } from '../../components/input-field'
import { EditableField } from '../../components/editable-field'

export interface Form {
  content: string | null
  author: string | undefined
  notificationNumber: string | undefined
  company: string | undefined
}

export const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [viewedNotifications, setView] = useState<INotification[]>([])
  const userContext = useContext(UserContext) as IUserContext
  const history = useHistory()
  const [open, setOpen] = useState<boolean>(false)
  const [viewComment, setViewComment] = useState<boolean>(false)
  const [comments, setComments] = useState<IComment[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [equipmentGroups, setEquipmentGroups] = useState<
    Record<string, boolean>
  >({})
  const [tags, setTags] = useState<INotification[]>([])
  const [failureTypes, setFailureTypes] = useState<Record<string, boolean>>({})
  const [years, setYears] = useState<Record<string, boolean>>({})
  const [selectedNotificationNumber, setSelectedNotificationNumber] = useState<
    string
  >()
  const [close, setClose] = useState<boolean>()

  const {
    get: notificationGet,
    put: notificationPut,
    response: notificationResponse,
    loading: notificationLoad,
  } = useFetch<APIResponse<INotification>>('/notifications', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    const getNotifications = async () => {
      const dataRequest = `/?company=${userContext.user?.companyName}`
      const notificationData: APIResponse<
        INotification[]
      > = await notificationGet(dataRequest)
      if (notificationResponse.ok) {
        setNotifications(notificationData.data)
        setView(notificationData.data)
        setEquipmentGroups(
          Object.entries(notificationData.data)
            .map((notification) => notification[1].equipmentGroupL2)
            .reduce((obj, name) => ({ ...obj, [name]: false }), {})
        )
        setFailureTypes(
          Object.entries(notificationData.data)
            .map((notification) =>
              notification[1].failureType
                ? notification[1].failureType
                : 'undefined'
            )
            .reduce((obj, name) => ({ ...obj, [name]: false }), {})
        )
        setYears(
          Object.entries(notificationData.data)
            .map((notification) =>
              notification[1].detectionDate
                ? new Date(notification[1].detectionDate)
                    .getFullYear()
                    .toString()
                : 'undefined'
            )
            .reduce((obj, name) => ({ ...obj, [name]: false }), {})
        )
      }
    }
    getNotifications()
  }, [notificationGet, notificationPut, notificationResponse, userContext.user])

  useEffect(() => {
    setTags(notifications)
  }, [notifications])

  useEffect(() => {
    const eqFilters = Object.entries(equipmentGroups)
      .filter((group) => group[1])
      .flatMap(([key]) => key)
    const failureTypeFilters = Object.entries(failureTypes)
      .filter((group) => group[1])
      .flatMap(([key]) => key)
    const yearFilters = Object.entries(years)
      .filter((group) => group[1])
      .flatMap(([key]) => key)

    setView(
      tags.filter(
        (notification) =>
          (eqFilters.length < 1 ||
            eqFilters.includes(notification.equipmentGroupL2)) &&
          (failureTypeFilters.length < 1 ||
            (notification.failureType
              ? failureTypeFilters.includes(notification.failureType)
              : failureTypeFilters.includes('undefined'))) &&
          (yearFilters.length < 1 ||
            yearFilters.includes(
              new Date(notification.detectionDate).getFullYear().toString()
            ))
      )
    )

    if (eqFilters.length + failureTypeFilters.length + yearFilters.length < 1) {
      setView(tags)
    }
  }, [equipmentGroups, tags, failureTypes, years])

  const calculateTotalDu = () => {
    return viewedNotifications.length
  }

  const {
    get: commentGet,
    post: commentPost,
    put: commentPut,
    del: commentDel,
    response: commentResponse,
    //loading: commentLoad,
  } = useFetch<APIResponse<INotification>>('/comments', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const getComments = async () => {
    const dataRequest = `/?company=${userContext.user?.companyName}`
    const commentData: APIResponse<IComment[]> = await commentGet(dataRequest)
    if (commentResponse.ok) {
      setComments(commentData.data)
    }
  }

  const postComment = async (content: string): Promise<void> => {
    const form = {
      company: userContext.user?.companyName,
      author: userContext.user?.username,
      content: content,
      notificationNumber: selectedNotificationNumber,
    }
    await commentPost(form)
    if (commentResponse.ok) {
      getComments()
    }
  }

  useEffect(() => {
    getComments()
  }, [commentGet, commentResponse, userContext.user])

  const deleteComment = async (comment: string) => {
    await commentDel(comment)
    if (commentResponse.ok) {
      getComments()
    }
  }

  useEffect(() => {
    setViewComment(false)
  }, [close])

  return notificationLoad ? (
    <div className={styles.loading}>
      <Loader type="Grid" color="grey" />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.center}>
        <Title title="Notifications" />
      </div>
      <div className={styles.statisticsContainer}>
        <div className={styles.statisticsText}>
          {'Total  number of notifications:'}
        </div>
        <div className={styles.statisticsNumber}>{calculateTotalDu()}</div>
      </div>
      <div className={styles.menucontainer}>
        <div className={styles.filtercontainer}>
          <Filter
            category="Equipment group L2"
            filters={equipmentGroups}
            onClick={(selected, newValue) => {
              setEquipmentGroups({
                ...equipmentGroups,
                [selected]: newValue,
              })
            }}
            key={'equipmentGroupL2'}
          />
          <Filter
            category="Failure Type"
            filters={failureTypes}
            onClick={(selected, newValue) => {
              setFailureTypes({
                ...failureTypes,
                [selected]: newValue,
              })
            }}
            key={'failureType'}
          />
          <SearchField
            variant="small"
            label={'Tag'}
            icon={'search'}
            placeholder="Search for tags..."
            suggestions={[]}
            onValueChanged={(value) =>
              setTags(
                notifications.filter((notification) =>
                  notification.tag.toLowerCase().includes(value.toLowerCase())
                )
              )
            }
            onClick={() => false}
          />
          <Filter
            category="Year"
            filters={years}
            onClick={(selected, newValue) => {
              setYears({
                ...years,
                [selected]: newValue,
              })
            }}
            key={'year'}
          />
        </div>
        <div className={styles.buttoncontainer}>
          <Button
            label={'Add more notifications'}
            size="small"
            onClick={() => history.push(MAIN_ROUTES.ADD_NOTIFICATIONS)}
          />
        </div>
      </div>
      <div className={styles.notificationscontainer}>
        <div>
          <div>
            <div className={styles.table}>
              <div>
                <table className={styles.headers}>
                  <tbody>
                    <tr>
                      <td>{'Notification number'}</td>
                      <td>{'Date'}</td>
                      <td>{'Equipment group L2'}</td>
                      <td>{'Tag'}</td>
                      <td>{'Short text (click for longer text)'}</td>
                      <td>{'Work order'}</td>
                      <td>{'Activity text'}</td>
                      <td> {'Detection method'}</td>
                      <td> {'F1'}</td>
                      <td> {'F2'}</td>
                      <td> {'Failure type'}</td>
                      <td>{'QA?'}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {viewedNotifications?.map((data, key) => (
              <RegisteredDataField key={key}>
                <label className={styles.fontSize}>
                  {data.notificationNumber}
                </label>
                <label className={styles.fontSize}>
                  {new Date(data.detectionDate as Date).toLocaleDateString()}
                </label>
                <label className={styles.fontSize}>
                  {data.equipmentGroupL2}
                </label>
                <label className={styles.fontSize}>{data.tag}</label>
                <label
                  onClick={() => {
                    setOpen(!open)
                    setSelectedNotificationNumber(data.notificationNumber)
                  }}
                  className={styles.clickable}
                >
                  {data.shortText}
                  {data.notificationNumber === selectedNotificationNumber ? (
                    <ViewLongText
                      title="Long text"
                      text={
                        viewedNotifications.filter(
                          (notification) =>
                            notification.notificationNumber ===
                            selectedNotificationNumber
                        )[0].longText ?? ''
                      }
                      isOpen={open}
                    />
                  ) : null}
                </label>
                <label className={styles.fontSize}>{data.workOrder}</label>
                <label className={styles.fontSize}>{data.activityText}</label>
                <label className={styles.fontSize}>
                  {data.detectionMethod}
                </label>
                <label className={styles.fontSize}>{data.F1}</label>
                <label className={styles.fontSize}>{data.F2}</label>
                <label className={styles.fontSize}>{data.failureType}</label>
                {data.qualityStatus ? (
                  <i
                    className={'material-icons ' + styles.checkedicon}
                    onClick={() => {
                      notificationPut(data._id, { qualityStatus: false })
                      window.location.reload()
                    }}
                  >
                    {'check'}
                  </i>
                ) : (
                  <i
                    className={'material-icons ' + styles.notcheckedicon}
                    onClick={() => {
                      notificationPut(data._id, { qualityStatus: true })
                      window.location.reload()
                    }}
                  >
                    {'clear'}
                  </i>
                )}
                <i
                  className={'material-icons ' + styles.icon}
                  onClick={() => {
                    setSelectedNotificationNumber(data.notificationNumber)
                    setViewComment(true)
                  }}
                >
                  {'comment'}
                  {data.notificationNumber === selectedNotificationNumber ? (
                    <CommentSection isOpen={viewComment}>
                      <i
                        className={'material-icons ' + styles.close}
                        onClick={() => setClose(!close)}
                      >
                        {'clear'}
                      </i>
                      <Title
                        title={'comments on: '}
                        dynamic={selectedNotificationNumber}
                      />
                      <div className={styles.commentsContainer}>
                        {comments
                          .filter(
                            (comment) =>
                              comment.notificationNumber ===
                              selectedNotificationNumber
                          )
                          .map((content, key) => (
                            <div key={key} className={styles.commentContent}>
                              {content.created ? (
                                <div className={styles.date}>
                                  {content.author +
                                    ': ' +
                                    new Date(content.created).toDateString()}
                                  <div
                                    className={
                                      'material-icons ' + styles.smallIcon
                                    }
                                    onClick={() => deleteComment(content._id)}
                                  >
                                    {'delete'}
                                  </div>
                                </div>
                              ) : null}
                              <div className={styles.comment} key={key}>
                                <EditableField
                                  type={'comment'}
                                  content={content.content}
                                  isAdmin={true}
                                  onSubmit={(value) => {
                                    commentPut(content._id, {
                                      content: value.content,
                                    })
                                    setComments(
                                      comments.filter((comment) =>
                                        comment._id === content._id
                                          ? {
                                              ...comment,
                                              content: value.content,
                                            }
                                          : comment
                                      )
                                    )
                                  }}
                                ></EditableField>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className={styles.writeComment}>
                        <InputField
                          variant="standard"
                          label="New"
                          type="text"
                          value={newComment ?? ''}
                          onValueChanged={(value) =>
                            setNewComment(value as string)
                          }
                        />
                        <i
                          className={'material-icons ' + styles.icon}
                          onClick={() => {
                            if (newComment !== '') {
                              postComment(newComment)
                            }
                            setNewComment('')
                          }}
                        >
                          {'send'}
                        </i>
                      </div>
                    </CommentSection>
                  ) : null}
                </i>
                <i
                  onClick={() =>
                    history.push(
                      MAIN_ROUTES.EDIT_NOTIFICATION.replace(
                        ':notificationId',
                        data._id.replace(' ', '+')
                      )
                    )
                  }
                  className={'material-icons ' + styles.icon}
                >
                  {'editor'}
                </i>
              </RegisteredDataField>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
