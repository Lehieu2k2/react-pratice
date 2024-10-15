import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserService";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import ModalEditUser from "./ModalEditUser";
import _, { debounce } from "lodash";
import ModalConfirm from "./ModalConfirm";
import "./TableUsers.scss";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [showModalAddNew, setShowModalAddNew] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState({});
  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");
  const [dataExport, setDataExport] = useState([]);
  const handleClose = () => {
    setShowModalAddNew(false);
    setShowModalEdit(false);
    setShowModalDelete(false);
  };

  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };

  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setShowModalEdit(true);
  };

  const handleDeleteUser = (user) => {
    setDataUserDelete(user);
    setShowModalDelete(true);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setTotalPages(res.total_pages);
      setListUsers(res.data);
    }
  };

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  const handleEditTableFromModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUsers[index].first_name = user.first_name;
    setListUsers(cloneListUsers);
    console.log(user);
  };

  const handleDeleteTableFromModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = cloneListUsers.filter((item) => item.id !== user.id);
    setListUsers(cloneListUsers);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);
    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
    setListUsers(cloneListUsers);
  };

  const handleSearch = debounce((event) => {
    let term = event.target.value;
    if (term) {
      let cloneListUsers = _.cloneDeep(listUsers);
      cloneListUsers = cloneListUsers.filter((item) =>
        item.email.includes(term)
      );
      setListUsers(cloneListUsers);
    } else {
      getUsers(1);
    }
  }, 500);

  const getDataExport = (event, done) => {
    let result = [];
    if (listUsers && listUsers.length > 0) {
      result.push(["Id", "Email", "First Name", "Last Name"]);
      listUsers.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });

      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("Only accept CSV files");
      }

      Papa.parse(file, {
        complete: function (results) {
          let rawCSV = results.data;
          // Check if the file has data or not
          if (rawCSV.length > 0) {
            //Check if the file has correct data FIELD format
            if (rawCSV[0] && rawCSV[0].length === 3) {
              // Check if the file has correct data HEADER format
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong format header");
              } else {
                let result = [];
                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    result.push(obj);
                  }
                });
                setListUsers(result);
              }
            } else {
              toast.error("Wrong format");
            }
          } else toast.error("Not found data in CSV file");
        },
      });
    }
  };

  return (
    <>
      <div className="my-3 add-new d-sm-flex">
        <span>List Users:</span>

        <div className="group-btn mt-sm-0 mt-2">
          <label htmlFor="test" className="btn btn-warning">
            <i class="fa-solid fa-file-import"></i> Import
          </label>
          <input
            type="file"
            id="test"
            hidden
            onChange={(event) => handleImportCSV(event)}
          />

          <CSVLink
            filename={"users.csv"}
            className="btn btn-primary"
            data={dataExport}
            asyncOnClick={true}
            onClick={getDataExport}
          >
            {" "}
            <i class="fa-solid fa-file-export"></i> Export
          </CSVLink>
          <button
            className="btn btn-success"
            onClick={() => setShowModalAddNew(true)}
          >
            Add new user
          </button>
        </div>
      </div>
      <div className="col-12 col-sm-4 my-3">
        <input
          className="form-control"
          placeholder="Enter an email"
          onChange={(event) => handleSearch(event)}
        />
      </div>
      <div className="customize-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="sort-header">
                <span>ID</span>
                <span>
                  <i
                    class="fa-solid fa-up-long"
                    onClick={() => handleSort("asc", "id")}
                  ></i>
                  <i
                    class="fa-solid fa-down-long"
                    onClick={() => handleSort("desc", "id")}
                  ></i>
                </span>
              </th>
              <th>Email</th>
              <th className="sort-header">
                <span>First Name</span>
                <span>
                  <i
                    class="fa-solid fa-up-long"
                    onClick={() => handleSort("asc", "first_name")}
                  ></i>
                  <i
                    class="fa-solid fa-down-long"
                    onClick={() => handleSort("desc", "first_name")}
                  ></i>
                </span>
              </th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listUsers &&
              listUsers.length > 0 &&
              listUsers.map((item, index) => {
                return (
                  <tr key={`user-${item.id}`}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>
                      <button
                        className="btn btn-info mx-3"
                        onClick={() => handleEditUser(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger mx-3"
                        onClick={() => handleDeleteUser(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />

      <ModalAddNew
        show={showModalAddNew}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />
      <ModalEditUser
        show={showModalEdit}
        handleClose={handleClose}
        dataUserEdit={dataUserEdit}
        handleEditTableFromModal={handleEditTableFromModal}
      />
      <ModalConfirm
        show={showModalDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteTableFromModal={handleDeleteTableFromModal}
      />
    </>
  );
};

export default TableUsers;
