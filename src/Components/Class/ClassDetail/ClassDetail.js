import "./ClassDetail.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Form,
  Flex,
  Modal,
  Table,
  Empty,
  Input,
  Space,
  Image,
  Select,
  Button,
  message,
  Dropdown,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { EditOutlined, DownloadOutlined } from "@ant-design/icons";

import Capitalize from "../../hook/capitalize";

import {
  changeClassroom,
  getClass,
  getSuggestion,
  renewClass,
} from "../../../Constant/Classrooms";
import { addNewReport } from "../../../Constant/Report";
import { getFacilityByClassAddress } from "../../../Constant/Facility";

const AddReport = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.success("Finish editing, your report is submited!");
  };
  const error = () => {
    messageApi.error("Network error!");
  };

  const deviceOptions = props.devices
    ? props.devices.map((device) => ({
        label: device.name,
        value: device.id,
      }))
    : [];

  const [isAddReport, setIsAddReport] = useState(false);
  const showAddReportModal = () => {
    setIsAddReport(true);
  };
  const handleCancel = () => {
    setIsAddReport(false);
  };
  const onFinishAdd = (values) => {
    let newReport = {
      note: values.note,
      accountId: props.user.accountID,
      classroomId: props.classroom.id,
      reportFacilities: values.devices,
    };

    addNewReport(newReport).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        success();
        setIsAddReport(false);
      } else {
        error();
        return 0;
      }
    });
  };

  return (
    <>
      {contextHolder}
      <Button style={{ border: "none" }} onClick={showAddReportModal}>
        <EditOutlined style={{ fontSize: 20 }} />
      </Button>

      <div>
        <Modal
          title="New Report"
          open={isAddReport}
          onCancel={handleCancel}
          footer={null}
        >
          <Form name="addNewReport" onFinish={onFinishAdd}>
            <Form.Item
              style={{ marginTop: 25 }}
              name="devices"
              rules={[
                {
                  required: true,
                  message: "Please select the device name!",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select Device"
                options={deviceOptions}
              ></Select>
            </Form.Item>

            <Form.Item name="note">
              <TextArea rows={4} placeholder="Note" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="new-user-form-button"
              >
                Confirm
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

const ClassDetail = () => {
  const params = useParams();

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.success("Finish editing, your class is up to date!");
  };
  const forbidden = () => {
    messageApi.error("Only admin can edit classroom information!");
  };
  const apiError = () => {
    messageApi.error("Network error! Please reconnect your wifi!");
  };
  const noChange = () => {
    messageApi.error("Nothing change, undo your request!");
  };

  const [classData, setClassData] = useState(null);
  const [changeInfo, setChangeInfo] = useState(null);
  const [changeOption, setChangeOption] = useState(null);
  const [classDevices, setClassDevices] = useState(null);
  const [changeClassId, setChangeClassId] = useState(null);

  useEffect(() => {
    async function getClassData(id) {
      let room = await getClass(id);
      setClassData(room);

      let facilities = await getFacilityByClassAddress(room.address);
      setClassDevices(facilities);

      let subRooms = await getSuggestion(id);
      setChangeInfo(subRooms);

      let options = [];
      subRooms.map((subRoom) => {
        let roomName = {
          label: subRoom.address,
          value: subRoom.address,
        };
        options.push(roomName);
      });
      setChangeOption(options);
    }
    getClassData(params.classID);
  }, []);

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

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  function handleEdit() {
    if (user.account.role == "USER") {
      forbidden();
      return 0;
    }
    setEditMode(true);
  }
  function handleCancel() {
    form.resetFields();
    setEditMode(false);
    setSwitchRoom(false);
  }

  const [switchRoom, setSwitchRoom] = useState(false);
  const onChangeToFix = (e) => {
    if (e == "fixing") {
      setSwitchRoom(true);
    }
  };
  const onFinishSwitchRoom = (values) => {
    setSwitchRoom(false);
    classData.note += `\nAll lecturers teaching in this room need to switch to ${values.address} room!\n${values.note}`;

    let changeClassId = changeInfo.filter(
      (elem) => elem.address == values.address
    )[0].id;
    setChangeClassId(changeClassId);
  };
  const onFinishEdit = (values) => {
    let isChange = false;
    let newClassInfo = classData;

    if (values.address) {
      isChange = true;
      newClassInfo.address = values.address;
    }
    if (values.lastUsed) {
      isChange = true;
      newClassInfo.lastUsed = values.lastUsed;
    }
    if (values.status != classData.status) {
      isChange = true;
      newClassInfo.status = values.status;
    }
    if (values.note) {
      isChange = true;
      newClassInfo.note = values.note;
    }

    if (changeClassId) {
      let errOccur = false;

      let changeData = {
        changeClassId: changeClassId,
        currentClassId: classData.id,
      };

      changeClassroom(changeData).then((res) => {
        if (res.status >= 200 && res.status < 300) {
          //success();
          //setEditMode(false);
        } else {
          errOccur = true;
          apiError();
        }
      });
    }

    if (isChange) {
      renewClass(newClassInfo).then((res) => {
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
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(classDevices);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Device List");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileName = "device_list.xlsx";
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, fileName);
  };

  return (
    <div class="m-10">
      {contextHolder}
      {classData ? (
        <Space direction="vertical" size={50}>
          {changeOption ? (
            <Modal
              title="Change room for lecturers"
              open={switchRoom}
              onCancel={handleCancel}
              footer={null}
            >
              <Form form={form} name="changeRoom" onFinish={onFinishSwitchRoom}>
                <Form.Item
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please choose at least one room!",
                    },
                  ]}
                >
                  <Select
                    options={changeOption}
                    style={{ marginTop: 25 }}
                  ></Select>
                </Form.Item>

                <Form.Item
                  name="note"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input placeholder="Note" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="new-user-form-button"
                  >
                    Confirm
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          ) : (
            <></>
          )}

          {classData ? (
            <Form
              form={form}
              colon={false}
              onFinish={onFinishEdit}
              autoComplete="off"
            >
              <Space size={100}>
                <Space direction="vertical" size={50}>
                  <Space>
                    <div class="text-2xl font-bold">
                      {classData ? (
                        classData.address.includes("Storage") ? (
                          `Storage's information`
                        ) : (
                          `Classroom's information`
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                    <Button style={{ border: "none" }} onClick={handleEdit}>
                      <EditOutlined style={{ fontSize: 20 }} />
                    </Button>
                  </Space>
                  <Space size={50}>
                    <Space direction="vertical">
                      <Form.Item
                        name="address"
                        label={<div class="font-bold text-xl">Address:</div>}
                      >
                        {editMode ? (
                          <Input
                            defaultValue={Capitalize(classData.address)}
                          ></Input>
                        ) : (
                          <div class="text-xl">
                            {Capitalize(classData.address)}
                          </div>
                        )}
                      </Form.Item>

                      <Form.Item
                        name="lastUsed"
                        label={
                          <div class="font-bold text-xl">Last used time:</div>
                        }
                      >
                        {editMode ? (
                          <Input defaultValue={classData.lastUsed}></Input>
                        ) : (
                          <span class="text-xl">
                            {classData.lastUsed.split("T")[0]} at{" "}
                            {classData.lastUsed.split("T")[1]}
                          </span>
                        )}
                      </Form.Item>
                    </Space>

                    <Space direction="vertical">
                      <Form.Item
                        name="status"
                        label={<div class="font-bold text-xl">Status:</div>}
                      >
                        {editMode ? (
                          <Select
                            placeholder="status"
                            onChange={(e) => {
                              onChangeToFix(e);
                            }}
                            options={[
                              {
                                value: "open",
                                label: "Open",
                              },
                              {
                                value: "close",
                                label: "Close",
                              },
                              {
                                value: "fixing",
                                label: "Fixing",
                              },
                            ]}
                          ></Select>
                        ) : (
                          <span class="text-xl">
                            {Capitalize(classData.status)}
                          </span>
                        )}
                      </Form.Item>

                      <Form.Item
                        name="facilityAmount"
                        label={
                          <div class="font-bold text-xl">
                            Number of devices:
                          </div>
                        }
                      >
                        <div class="text-xl">{classData.facilityAmount}</div>
                      </Form.Item>
                    </Space>
                  </Space>

                  <Space direction="vertical" size="large">
                    <div class="text-2xl font-bold">Note</div>
                    {editMode ? (
                      <Form.Item name="note">
                        {classData.note ? (
                          <TextArea
                            rows={5}
                            style={{ minWidth: 640 }}
                            defaultValue={classData.note}
                          ></TextArea>
                        ) : (
                          <Empty class="text-xl" description={false}></Empty>
                        )}
                      </Form.Item>
                    ) : (
                      <>
                        {classData.note ? (
                          <p class="text-xl">{classData.note}</p>
                        ) : (
                          <Empty class="text-xl" description={false}></Empty>
                        )}
                      </>
                    )}
                  </Space>
                </Space>

                <div class="ml-10">
                  <Image
                    src={require("../../../assets/classroom.png")}
                    width={200}
                    height={200}
                  />
                </div>
              </Space>

              <Form.Item>
                {editMode ? (
                  <Flex
                    style={{ marginTop: 50 }}
                    justify="center"
                    align="center"
                  >
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
          ) : (
            <></>
          )}

          <Space direction="vertical" size={25}>
            <Space direction="horizontal">
              <div class="text-2xl font-bold">Devices list</div>

              <AddReport
                user={user}
                classroom={classData}
                devices={classDevices}
              />

              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={exportToExcel}
                style={{
                  borderRadius: "5px",
                  fontWeight: "bold",
                  backgroundColor: "#f0f0f0",
                  color: "#000",
                }}
              >
                Export to Excel
              </Button>
            </Space>

            {classDevices ? (
              <Table
                columns={devicesColumns}
                dataSource={classDevices}
                style={{ minWidth: 1200 }}
              ></Table>
            ) : (
              <></>
            )}
          </Space>
        </Space>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ClassDetail;
