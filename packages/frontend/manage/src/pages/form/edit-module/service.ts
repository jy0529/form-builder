import { BizFormParams } from '@/business';

const KEYS = {
  FORM_MODELS: 'formModels'
}

const getFormModels = () => {
  return JSON.parse(localStorage.getItem(KEYS.FORM_MODELS) ?? '[]')
}

const saveFormModels = (models: Array<BizFormParams>) => {
  localStorage.setItem(KEYS.FORM_MODELS, JSON.stringify(models))
}

export async function addFormModel(params: BizFormParams) {
  const formModels = getFormModels();
  const lastId = formModels.length > 0 ? formModels[formModels.length - 1].id : 0;
  formModels.push({
    id: lastId + 1,
    ...params
  });
  saveFormModels(formModels);

  return Promise.resolve({
    success: true,
    error: null
  });
}
