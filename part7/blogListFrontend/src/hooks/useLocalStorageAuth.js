import { useEffect } from 'react'
import { useQueryClient } from 'react-query'

import blogService from '../services/blogs.js'

import { login as UClogin, logout as UClogout, useUserDispatch } from '../UserContext.js'

export const useLocalStorageAuth = () => {
  const queryClient = useQueryClient()
  const userDispatch = useUserDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const userParsedJSON = JSON.parse(loggedUserJSON)
      userDispatch(UClogin(userParsedJSON))
      blogService.setToken(userParsedJSON.token)

    }
  }, [])

  const logout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    queryClient.removeQueries({ queryKey: ['blogs'] })
    userDispatch(UClogout())
    blogService.clearToken()
  }

  const service = {
    logout
  }

  return service

}
