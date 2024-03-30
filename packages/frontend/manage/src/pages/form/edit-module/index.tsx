import { BizFormItem, BizFormTypeEnum, BizFormTypeNameEnum } from '@/business';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Flex, Form, FormInstance, Input, Modal, Radio, Space, Switch, Table, Typography, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { getFormItemsByType } from './components/DynamicFormItems';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { addFormModel } from './service';

type CommonFieldType = {
  name: BizFormItem['name']
  type: BizFormItem['type']
}

const enumToObject = (enumObject: any) => {
  let result = {};
  for (let key in enumObject) {
    if (isNaN(Number(key))) {
      result[key] = enumObject[key];
    }
  }
  return result;
};

const BizFormType = enumToObject(BizFormTypeEnum)
const BizFormTypeName = enumToObject(BizFormTypeNameEnum);

const FormItemTypes = Object.keys(BizFormTypeName).map((key) => ({
  label: BizFormTypeName[key],
  value: BizFormType[key]
}))

interface FormItemEditProps {
  initialValues?: BizFormItem
  modalVisible: boolean
  handleCancel: (form: FormInstance) => void
  handleSave: (form: FormInstance) => void;
}
const FormItemEdit: FC<FormItemEditProps> = ({
  initialValues,
  modalVisible,
  handleCancel,
  handleSave
}: FormItemEditProps) => {

  const [form] = Form.useForm()

  // type watch
  const formItemType = Form.useWatch('type', form)

  const onSave = () => {
    handleSave(form)
  }

  const onCancel = () => {
    handleCancel(form)
  }

  const defaultValues = {
    name: '',
    type: BizFormTypeEnum.SINGLE_LINE_TEXT,
    visible: true,
    required: true,
  };

  let InitialValues = initialValues;
  if (!initialValues) {
    InitialValues = defaultValues;
  }
  useEffect(() => {
    if (modalVisible) {
      form.setFieldsValue(InitialValues)
    } else {
      form.resetFields()
    }

  }, [modalVisible])

  return (
    <Modal title="添加/编辑表单项" open={modalVisible} width={650} onCancel={onCancel} onOk={onSave}>
      <Form name="editFormItemModule" form={form} labelCol={{ span: 3 }}>
        <Form.Item<CommonFieldType>
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入项名称' }]}
        >
          <Input placeholder="请输入项名称" />
        </Form.Item>
        <Form.Item<CommonFieldType>
          label="类型"
          name="type"
          rules={[{ required: true, message: '请选择项类型' }]}
        >
          <Radio.Group>
            {
              FormItemTypes.map((item) => (
                <Radio key={item.value} value={item.value}>{item.label}</Radio>
              ))
            }
          </Radio.Group>
        </Form.Item>
        {/* 动态表单项 */}
        {
          getFormItemsByType(formItemType)
        }
      </Form>
    </Modal>

  )
}

const createFormItem = (config: BizFormItem): BizFormItem => {
  const defaults = {
    name: '',
    type: BizFormTypeEnum.SINGLE_LINE_TEXT,
    visible: true,
    required: true
  };

  return {
    ...defaults,
    ...config
  }
};

const FormEditModule: FC<Record<string, any>> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [form] = Form.useForm();
  const [moduleData, setModuleData] = useState<{
    name: string,
    items: BizFormItem[]
  }>({
    name: '',
    items: []
  })
  const [activeData, setActiveData] = useState<BizFormItem & { index: number } | undefined>();

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    form.setFieldsValue(moduleData)
  }, [moduleData])

  const addFormItem = () => {
    setActiveData(undefined);
    setModalVisible(true)
  }
  const handleCancel = (formEditItem: FormInstance) => {
    setModalVisible(false)
    formEditItem.resetFields()
  }

  const updateItem = (newData: Partial<BizFormItem>, index: number) => {
    const newItems = moduleData.items.map((item, i) => {
      if (i === index) {
        return createFormItem({
          ...item,
          ...newData,
        })
      }
      return item
    })
    setModuleData({
      ...moduleData,
      items: newItems
    });
  }

  const handleSaveFormItem = (formEditItem: FormInstance) => {
    formEditItem.validateFields().then((values) => {
      if (activeData) {
        // edit
        updateItem(values, activeData.index);
      } else {
        // add
        const formItem = createFormItem(values)
        setModuleData({
          ...moduleData,
          items: [...moduleData.items, formItem]
        });
      }

      setModalVisible(false)
    })
  }

  const removeFormItem = (index: number) => {
    const newItems = moduleData.items.filter((_, i) => i !== index)
    setModuleData({
      ...moduleData,
      items: newItems
    });
  }

  const editFormItem = (index: number) => {
    setActiveData({
      ...moduleData.items[index],
      index,
    })
    setModalVisible(true)
  }

  const changeRequired = (required: boolean, index: number) => {
    const item = moduleData.items[index];
    updateItem({
      ...item,
      required: required
    }, index)
  }

  const changeVisible = (visible: boolean, index: number) => {
    const item = moduleData.items[index];
    updateItem({
      ...item,
      visible: visible
    }, index)
  }

  const submit = () => {
    form.validateFields().then((values) => {
      console.log('values', values)
      addFormModel(values).then((res) => {
        if (res.success === true) {
          messageApi.success('提交成功');
          form.resetFields();
        }
      })
    })
  }

  return (
    <PageContainer>
      {contextHolder}
      <Card bordered={false}>
        <Flex vertical gap={15} style={{
          maxWidth: 800
        }}>

          <Form name="editFormModule" form={form} initialValues={moduleData}>
            <Typography.Title level={5}>基本设置</Typography.Title>
            <Form.Item label="表单名称" name="name" rules={[{
              required: true,
              message: '请输入表单名称'
            }]}>
              <Input placeholder="请输入表单名称" maxLength={50} style={{
                maxWidth: 300
              }} />
            </Form.Item>

            {/* 表单内容 */}
            <Flex vertical>
              <Typography.Title level={5}>表单内容</Typography.Title>
              <Button style={{ maxWidth: 100 }} onClick={addFormItem}>添加表单项</Button>
            </Flex>
            {/* 添加/编辑弹窗 */}
            <FormItemEdit
              initialValues={activeData}
              modalVisible={modalVisible}
              handleCancel={handleCancel}
              handleSave={handleSaveFormItem}
            />
            <Form.List name="items" key="name">
              {
                () => (
                  <>
                    <Table dataSource={moduleData.items} pagination={false} rowKey="name">
                      <Table.Column
                        title="项名称"
                        align='center'
                        dataIndex="name"
                        width={100}
                        render={
                          (value) => (
                            <span>{value}</span>
                          )
                        }
                      >
                      </Table.Column>
                      <Table.Column
                        title="表单项类型"
                        align='center'
                        dataIndex="type"
                        width={100}
                        render={
                          (value) => (
                            <span>{BizFormTypeName[BizFormTypeEnum[value]]}</span>
                          )
                        }
                      >
                      </Table.Column>
                      <Table.Column
                        title="显示"
                        align='center'
                        dataIndex="visible"
                        width={100}
                        render={
                          (value, row, index) => (
                            <Switch
                              checked={value}
                              checkedChildren={
                                <CheckOutlined />
                              }
                              unCheckedChildren={
                                <CloseOutlined />
                              }
                              onChange={(visible) => {
                                changeVisible(visible, index)
                              }}
                            />
                          )
                        }
                      >
                      </Table.Column>
                      <Table.Column
                        title="必填"
                        align='center'
                        dataIndex="required"
                        width={100}
                        render={
                          (value, row, index) => (
                            <Switch
                              checked={value}
                              checkedChildren={
                                <CheckOutlined />
                              }
                              unCheckedChildren={
                                <CloseOutlined />
                              }
                              onChange={(checked) => {
                                changeRequired(checked, index)
                              }}
                            />
                          )
                        }
                      >
                      </Table.Column>
                      <Table.Column
                        title="操作"
                        align='center'
                        width={200}
                        render={
                          (value, record, index) => (
                            <>
                              <Button type='link' onClick={() => editFormItem(index)}>编辑</Button>
                              <Button type='link' danger onClick={() => removeFormItem(index)}>删除</Button>
                            </>
                          )
                        }
                      >
                      </Table.Column>
                    </Table>
                  </>
                )
              }
            </Form.List>

            <Form.Item>
              <Space direction="vertical" size="middle">
                <Button type='primary' onClick={submit}>提交</Button>
              </Space>
            </Form.Item>
          </Form>
        </Flex>
      </Card>
    </PageContainer>
  )
}

export default FormEditModule
