import { BizFormItem, BizFormTypeEnum, PlaceholderProps } from '@/business';
import { Form, Input } from 'antd';

// Placeholder
const Placeholder = (props: PlaceholderProps) => {
  return (
    <Form.Item
      name={['private', 'placeholder']}
      label="提醒文字"
    >
      <Input maxLength={props?.maxLength ?? 50} />
    </Form.Item>
  )
}

// SINGLE_LINE_TEXT
const SingleLineText = () => {
  return (
    <Placeholder />
  )
}

// RADIO
const Radio = () => {
  return (
    <Form.Item name={['private', 'radioText']} label="选项">
      <Input.TextArea></Input.TextArea>
    </Form.Item>
  )
}

// Checkbox
const Checkbox = () => {
  return (
    <Form.Item name={['private', 'checkboxText']} label="选项">
      <Input.TextArea></Input.TextArea>
    </Form.Item>
  )
}

// Select
const Select = () => {
  return (
    <>
      <Form.Item name={['private', 'selectText']} label="选项">
        <Input.TextArea></Input.TextArea>
      </Form.Item>
      <Placeholder />
    </>
  )
}

const DynamicFormItems = (type: BizFormItem['type']) => {
  switch (type) {
    case BizFormTypeEnum.SINGLE_LINE_TEXT: {
      return <SingleLineText />
    }
    case BizFormTypeEnum.RADIO: {
      return <Radio />;
    }
    case BizFormTypeEnum.CHECKBOX: {
      return <Checkbox />;
    }
    case BizFormTypeEnum.SELECT: {
      return <Select />;
    }
    default: {
      return null;
    }
  }
}

export const getFormItemsByType = (type: BizFormItem['type']) => {
  return DynamicFormItems(type)
}
