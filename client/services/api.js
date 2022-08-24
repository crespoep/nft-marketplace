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
  initFormData
}
