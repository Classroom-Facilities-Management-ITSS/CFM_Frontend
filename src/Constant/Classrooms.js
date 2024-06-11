async function getClassroomList() {
  var response = await fetch(
    `https://b67d-27-72-100-200.ngrok-free.app/api/v1/classroom`
  );
  var data = await response.json();

  let Classrooms = [];
  data.data.map((elem) => {
    let product = {
      id: elem.id,
      note: elem.note,
      status: elem.status,
      address: elem.address,
      maxSize: elem.maxSize,
      lastUsed: elem.lastUsed,
      facilityAmount: elem.facilityAmount,
    };

    Classrooms = [...Classrooms, product];
  });

  return Classrooms;
}

export { getClassroomList as getClassroomList };
