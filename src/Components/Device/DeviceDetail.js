import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Flex,
  Form,
  Input,
  Space,
  Image,
  Empty,
  Table,
  Select,
  Button,
  message,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import Capitalize from "../hook/capitalize";

import {
  getFacility,
  getFacilityByClassAddress,
  removeFacility,
  renewFacility,
} from "../../Constant/Facility";
import { getClassList } from "../../Constant/Classrooms";

const DeviceDetail = () => {
  const nav = useNavigate();
  const params = useParams();

  const [messageApi, contextHolder] = message.useMessage();
  const error = () => {
    messageApi.info("Only admin can edit this section!");
  };
  const success = () => {
    messageApi.success("Finish editing, device is up to date!");
  };
  const apiError = () => {
    messageApi.error("Network error! Please reconnect your wifi!");
  };
  const noChange = () => {
    messageApi.error("Nothing change, undo your request!");
  };
  const deleteSuccess = () => {
    messageApi.success("Delete class successfully!");
  };
  const deleteFail = () => {
    messageApi.error("Can't delete this class at this time!");
  };

  const [deviceData, setDeviceData] = useState(null);
  const [othersDevice, setOthersDevice] = useState(null);

  useEffect(() => {
    async function getData() {
      let device = await getFacility(params.deviceID);
      setDeviceData(device);

      let deviceList = await getFacilityByClassAddress(
        device.classroom.address
      );
      let others = deviceList.filter((elem) => elem.id != device.id);
      setOthersDevice(others);
    }
    getData();
  }, [params]);

  const [location, setLocation] = useState(null);

  useEffect(() => {
    async function getLocation() {
      let options = [];

      let address = await getClassList();
      address.map((elem) => {
        let option = {
          value: elem.id,
          label: elem.address,
        };

        options.push(option);
      });

      setLocation(options);
    }
    getLocation();
  }, [params]);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

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

  const [editMode, setEditMode] = useState(false);
  function handleEdit() {
    if (user.account.role == "USER") {
      error();
      return 0;
    }
    setEditMode(true);
  }
  function handleCancel() {
    setEditMode(false);
  }
  function handleDelete() {
    removeFacility(deviceData.id).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        deleteSuccess();
        nav(`/classList`);
      } else {
        deleteFail();
      }
    });
  }
  function onFinishEdit(values) {
    let isChange = false;
    let newDeviceInfo = deviceData;

    if (values.name) {
      isChange = true;
      newDeviceInfo.name = values.name;
    }
    if (values.version) {
      isChange = true;
      newDeviceInfo.version = values.version;
    }
    if (values.status != deviceData.status) {
      isChange = true;
      newDeviceInfo.status = values.status;
    }
    if (values.location) {
      isChange = true;
      newDeviceInfo.classroomId = values.location;
    }
    if (values.note) {
      isChange = true;
      newDeviceInfo.note = values.note;
    }

    let updateData = {
      id: newDeviceInfo.id,
      name: newDeviceInfo.name,
      count: newDeviceInfo.count,
      status: newDeviceInfo.status,
      version: newDeviceInfo.version,
      classroomId: newDeviceInfo.classroomId,
      note: newDeviceInfo.note,
    };

    if (isChange) {
      renewFacility(updateData).then((res) => {
        if (res.status >= 200 && res.status < 300) {
          success();
          setEditMode(false);
        } else {
          apiError();
        }
      });
    } else {
      noChange();
    }
  }

  return (
    <div class="m-10">
      {contextHolder}
      {deviceData ? (
        <Space direction="vertical" size={50}>
          <Form colon={false} onFinish={onFinishEdit} autoComplete="off">
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
                        <Input
                          defaultValue={Capitalize(deviceData.name)}
                        ></Input>
                      ) : (
                        <div class="text-xl">{Capitalize(deviceData.name)}</div>
                      )}
                    </Form.Item>

                    <Form.Item
                      name="status"
                      label={<div class="font-bold text-xl">Status:</div>}
                    >
                      {editMode ? (
                        <Select
                          placeholder="status"
                          options={[
                            {
                              value: "NEW",
                              label: "NEW",
                            },
                            {
                              value: "OLD",
                              label: "OLD",
                            },
                            {
                              value: "FIXING",
                              label: "FIXING",
                            },
                            {
                              value: "USING",
                              label: "USING",
                            },
                            {
                              value: "NOTFOUND",
                              label: "NOTFOUND",
                            },
                          ]}
                        ></Select>
                      ) : (
                        <span class="text-xl">
                          {deviceData.status}
                        </span>
                      )}
                    </Form.Item>

                    <Form.Item
                      name="location"
                      label={<div class="font-bold text-xl">Location:</div>}
                    >
                      {editMode ? (
                        <Select
                          placeholder="location"
                          options={location}
                        ></Select>
                      ) : (
                        <span class="text-xl">
                          {Capitalize(deviceData.classroom.address)}
                        </span>
                      )}
                    </Form.Item>
                  </Space>

                  <Space direction="vertical">
                    <Form.Item
                      name="version"
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

                    <Button
                      type=""
                      danger
                      htmlType="submit"
                      onClick={handleDelete}
                    >
                      Delete
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default DeviceDetail;
