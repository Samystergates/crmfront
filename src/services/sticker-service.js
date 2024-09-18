import { myAxios } from "./helper";
import { privateAxios } from "./helper";

export const loadSticker = (stickerDto) => {
    return privateAxios.post(`/sticker/label/get`, stickerDto)
      .then((response) => response.data);
  };

  export const saveSticker = (stickerDto) => {
    return privateAxios.post(`/sticker/label/save`, stickerDto)
      .then((response) => response.data);
  };

  export const updateSticker = (stickerDto) => {
    return privateAxios.put(`/sticker/label/update`, stickerDto)
      .then((response) => response.data);
  };

  export const deleteSticker = (stickerId) => {
    return privateAxios.delete(`/sticker/label/delete/${stickerId}`)
      .then((response) => response.data);
  };

  export const loadAllStickers = () => {
    return myAxios
      .get(`/sticker/label/getAll`)
      .then((response) => response.data);
  };