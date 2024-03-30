export interface BizFormParams {
  name: string
  items: BizFormItem[]
}

export interface BizFormItem {
  name: string
  type: BizFormType
  visible: boolean
  required: boolean
  private?: Record<string, any>
}

export enum BizFormTypeEnum {
  SINGLE_LINE_TEXT = 0,
  RADIO = 1,
  CHECKBOX = 2,
  SELECT = 3,
}

export enum BizFormTypeNameEnum {
  SINGLE_LINE_TEXT = '单行文本',
  RADIO = '单选',
  CHECKBOX = '多选',
  SELECT = '下拉',
}

export enum CustomOption {
  DEFAULT = 0,
  CUSTOM = 1,
}

export type BizFormType = BizFormTypeEnum;

export interface PlaceholderProps {
  maxLength?: number,
}

export interface BizFormSingleLineText extends BizFormItem {
  placeholder: PlaceholderProps
  countLimit: {
    type: CustomOption.DEFAULT | CustomOption.CUSTOM
    minLength: number
    maxLength: number
  }
}
