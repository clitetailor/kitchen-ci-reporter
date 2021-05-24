import { useEffect, useState } from "react";
import { Select, Switcher, Table, Pane } from "@moai/core";
import { useFetch } from "use-http";

import "./App.css";

const FILTER = {
  ALL: "ALL",
  FAILED: "FAILED",
  SUCCESS: "SUCCESS",
};

const PLATFORM = {
  WINDOWS: "WINDOWS",
  UBUNTU: "UBUNTU",
  DEBIAN: "DEBIAN",
  CENTOS: "CENTOS",
};

function App() {
  const [filter, setFilter] = useState(FILTER.ALL);
  const [platform, setPlatform] = useState(PLATFORM.WINDOWS);

  const [controls, setControls] = useState([]);

  const { get, response } = useFetch("/data/data.json");

  useEffect(() => {
    (async function () {
      const controls = await get();

      if (response.ok) {
        console.log(controls);

        setControls(controls);
      }
    })().catch((err) => console.log(err));
  }, [get, response]);

  return (
    <div className="padding-8">
      <div className="flex margin-bottom-8">
        <div className="flex-auto">
          <Select
            options={[
              {
                value: PLATFORM.WINDOWS,
                id: PLATFORM.WINDOWS,
                label: "Windows",
              },
              {
                value: PLATFORM.UBUNTU,
                id: PLATFORM.UBUNTU,
                label: "Ubuntu",
              },
              {
                value: PLATFORM.DEBIAN,
                id: PLATFORM.DEBIAN,
                label: "Debian",
              },
              {
                value: PLATFORM.CENTOS,
                id: PLATFORM.CENTOS,
                label: "Centos",
              },
            ]}
            value={platform}
            setValue={setPlatform}
          ></Select>
        </div>
        <div className="margin-left-8">
          <Switcher
            value={filter}
            setValue={setFilter}
            options={[
              { value: FILTER.ALL, label: "All" },
              {
                value: FILTER.SUCCESS,
                label: "Success",
              },
              {
                value: FILTER.FAILED,
                label: "Failed",
              },
            ]}
          ></Switcher>
        </div>
      </div>

      <div>
        <Table
          size={Table.sizes.large}
          rows={controls.map((control) => ({
            ...control,
            status: true,
          }))}
          rowKey={(control) => control.id}
          columns={[
            { title: "Suite", render: "desc", fill: true },
            {
              title: "Pass/Failed",
              render: "status",
            },
          ]}
          expandRowRender={(control) => (
            <Pane>
              <Table
                rows={[control]}
                rowKey={(control) => control.id}
                columns={[
                  { title: "ID", render: "id" },
                  { title: "Desc", render: "desc" },
                  {
                    title: "Status",
                    render: (control) =>
                      control.results.reduce(
                        (final, result) => result.status === "passed" && final,
                        true
                      )
                        ? "Passed"
                        : "Failed",
                  },
                ]}
              ></Table>
            </Pane>
          )}
        ></Table>
      </div>
    </div>
  );
}

export default App;
