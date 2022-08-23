const getNFTs = async () => {
  const response = await fetch("/api/nfts")
  return await response.json();
}

const createImageInIPFS = async file => {
  const formData = initFormData({ data: null })
  formData.append('file', file)

  return await uploadForm({ action: 'createImageInIPFS', formData: formData });
}

const createMetadataInIPFS = async data => {
  const action = 'createMetadataInIPFS';
  const response = await
    fetch(`/api/nft/create?action=${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  return await response.json()
}

const createNFTinDB = async data => {
  const action = 'createNFTinDB'
  const response = await
    fetch(`/api/nft/create?action=${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  return await response.json();
}

async function uploadForm({ action, formData }) {
  const response = await
    fetch(`/api/nft/create?action=${action}`, {
      method: "POST",
      body: formData
    })
  return await response.json()
}

// pending implementation
const initFormData = ({ data }) => {
  const formData = new FormData()
  if (data) {
    Object.entries({ ...data }).forEach(([key, value]) => {
      formData.append(key, value);
    })
  }

  return formData;
}

export {
  getNFTs,
  createMetadataInIPFS,
  createImageInIPFS,
  createNFTinDB
}
