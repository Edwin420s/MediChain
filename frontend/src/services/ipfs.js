class IPFSService {
  constructor() {
    this.apiKey = import.meta.env.VITE_IPFS_API_KEY
    this.baseURL = 'https://api.web3.storage'
  }

  async uploadFile(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, cid: data.cid }
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      return { success: false, error: error.message }
    }
  }

  async retrieveFile(cid) {
    try {
      const response = await fetch(`https://${cid}.ipfs.dweb.link`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      return { success: true, blob }
    } catch (error) {
      console.error('Error retrieving from IPFS:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new IPFSService()