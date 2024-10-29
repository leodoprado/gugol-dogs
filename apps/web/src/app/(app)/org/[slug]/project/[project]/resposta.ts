// Função para aplicar operações de outros clientes
const applyRemoteOperation = (operation: Operation) => {
  const { index, chars, type } = operation
  setContent((prevDoc) => {
    if (type === 'insert') {
      return prevDoc.slice(0, index) + chars + prevDoc.slice(index)
    } else if (type === 'delete') {
      return prevDoc.slice(0, index) + prevDoc.slice(index + chars.length)
    }
    return prevDoc
  })
}
