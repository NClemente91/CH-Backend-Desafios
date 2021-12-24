const messageDTO = (msj) => {
  const newMsj = {
    _id: Math.random().toString(36).substring(0, 10),
    author: msj.author,
    hora: `[${new Date().toLocaleString()}]`,
    text: msj.text,
  };
  return newMsj;
};

module.exports = {
  messageDTO,
};
