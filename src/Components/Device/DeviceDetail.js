import "../../output.css";

import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Space, Image, Empty, Button, Input, Flex, Form, message, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import Capitalize from "../hook/capitalize";

import devicesData from "../../Constant/initialData/device.json";
import classesData from "../../Constant/initialData/classroom.json";

const DeviceDetail = () => {
  const params = useParams();

  const deviceData = devicesData.filter(
    (device) => device.id == params.deviceID
  )[0];
  const othersDevice = devicesData.filter(
    (device) => device.classID == params.classID && device.id != deviceData.id
  );
  const deviceLocaltion = classesData.filter(
    (localtion) => localtion.id == params.classID
  )[0];

  const devicesColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/detail/classroom/${params.classID}/device/${record.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Note",
      key: "note",
      dataIndex: "note",
    },
  ];

  const [messageApi, contextHolder] = message.useMessage();
  const info = () => {
    messageApi.info("Done! Wait for admin to check.");
  };

  const [editMode, setEditMode] = useState(false);
  function handleEdit() {
    setEditMode(true);
  }
  function handleCancel() {
    setEditMode(false);
  }

  return (
    <div class="m-10">
      {contextHolder}
      <Space direction="vertical" size={50}>
        <Form colon={false} onFinish={info} autoComplete="off">
          <Space size={100}>
            <Space direction="vertical" size={50}>
              <Space>
                <div class="text-2xl font-bold">Device's information</div>
                <Button style={{ border: "none" }} onClick={handleEdit}>
                  <EditOutlined style={{ fontSize: 20 }} />
                </Button>
              </Space>
              <Space size={50}>
                <Space direction="vertical">
                  <Form.Item
                    name="name"
                    label={<div class="font-bold text-xl">Name: </div>}
                  >
                    {editMode ? (
                      <Input defaultValue={Capitalize(deviceData.name)}></Input>
                    ) : (
                      <div class="text-xl">{Capitalize(deviceData.name)}</div>
                    )}
                  </Form.Item>

                  <Form.Item
                    name="lastUsed"
                    label={<div class="font-bold text-xl">Status:</div>}
                  >
                    {editMode ? (
                      <Input
                        defaultValue={Capitalize(deviceData.status)}
                      ></Input>
                    ) : (
                      <span class="text-xl">
                        {Capitalize(deviceData.status)}
                      </span>
                    )}
                  </Form.Item>
                </Space>

                <Space direction="vertical">
                  <Form.Item
                    name="status"
                    label={<div class="font-bold text-xl">Version:</div>}
                  >
                    {editMode ? (
                      <Input defaultValue={deviceData.version}></Input>
                    ) : (
                      <span class="text-xl">{deviceData.version}</span>
                    )}
                  </Form.Item>

                  <Form.Item
                    name="facilityAmount"
                    label={
                      <div class="font-bold text-xl">Number of devices:</div>
                    }
                  >
                    <div class="text-xl">{deviceData.count}</div>
                  </Form.Item>
                </Space>
              </Space>

              <Space direction="vertical" size="large">
                <div class="text-2xl font-bold">Note</div>
                {editMode ? (
                  <Form.Item name="note">
                    {deviceData.note ? (
                      <TextArea
                        rows={5}
                        style={{ minWidth: 640 }}
                        defaultValue={deviceData.note}
                      ></TextArea>
                    ) : (
                      <Empty class="text-xl" description={false}></Empty>
                    )}
                  </Form.Item>
                ) : (
                  <>
                    {deviceData.note ? (
                      <p class="text-xl">{deviceData.note}</p>
                    ) : (
                      <Empty class="text-xl" description={false}></Empty>
                    )}
                  </>
                )}
              </Space>
            </Space>

            <div class="ml-10">
              <Image
                src={require("../../assets/classroom.png")}
                width={200}
                height={200}
              />
            </div>
          </Space>

          <Form.Item>
            {editMode ? (
              <Flex style={{ marginTop: 50 }} justify="center" align="center">
                <Space size={10}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button type="" htmlType="submit" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Space>
              </Flex>
            ) : (
              <></>
            )}
          </Form.Item>
        </Form>
        
        <Space direction="vertical" size={25}>
          <div class="text-2xl font-bold">Others devices</div>
          <Table
          scroll={{ y: 200 }}
            columns={devicesColumns}
            dataSource={othersDevice}
            style={{ minWidth: 1200 }}
            pagination={{ pageSize: 10 }}
          ></Table>
        </Space>
      </Space>
    </div>
  );
};

export default DeviceDetail;
