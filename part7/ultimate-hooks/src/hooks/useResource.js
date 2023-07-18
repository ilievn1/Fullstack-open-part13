import { useState, useEffect } from 'react'
import axios from 'axios'

export const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])
    
    const config = {
      headers: { 'Authorization': 'sampletoken' }
    }
  
    useEffect(() => {  
      const fetchResources = async () => {
        const response = await axios.get(baseUrl,config)
        setResources(response.data)
      }
  
      if (baseUrl) {
        fetchResources().catch(console.error)
      }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl])
  
    const create = async (resource) => {
      const response = await axios.post(baseUrl, resource, config)
      setResources(resources.concat(response.data))
    }
  
    const service = {
      create
    }
  
    return [
      resources, service
    ]
}
