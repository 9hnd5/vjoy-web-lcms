import { Box, Button, FormControl, Grid, GridProps, InputLabel, Select } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { GAME_TYPE, LESSON_DIFFICULTY } from "gms/services/lessonService";
import { useGetLevelsQuery } from "gms/services/levelService";
import { useGetUnitsQuery } from "gms/services/unitService";
import { merge } from "lodash";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type EditorSceneProps = {
  isSaving?: boolean;
  isPublising?: boolean;
  children?: React.ReactNode;
  leftProps?: Omit<GridProps, "item" | "container" | "children">;
  midProps?: Omit<GridProps, "item" | "container" | "children">;
  rightProps?: Omit<GridProps, "item" | "container" | "children">;
  onNew?: () => void;
  onLoad?: () => void;
  onSave?: () => void;
  onPublish?: () => void;
} & Omit<GridProps, "item" | "container" | "children">;

const EditorScene = (props: EditorSceneProps) => {
  const {
    children,
    isSaving,
    isPublising,
    onSave,
    onLoad,
    onPublish,
    onNew,
    leftProps,
    midProps,
    rightProps,
    ...restProps
  } = props;

  const { data: { data: level } = { data: { rows: [], count: 0 } } } = useGetLevelsQuery();

  const { data: { data: unit } = { data: { rows: [], count: 0 } } } = useGetUnitsQuery();

  const navigate = useNavigate();

  const { control, watch } = useFormContext();

  const id = watch("id");

  return (
    <Grid container spacing={1} {...merge(restProps, { sx: { height: "100vh", p: 1 } })}>
      <Grid item xs={2} {...leftProps}>
        <Box
          sx={{
            border: `solid 3px ${blueGrey[300]}`,
            borderRadius: "4px",
            boxSizing: "border-box",
            p: 1,
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <Controller
              control={control}
              name="levelId"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel size="small">Level</InputLabel>
                  <Select label="Level" size="small" native disabled {...field}>
                    {level.rows.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="unitId"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel size="small">Unit</InputLabel>
                  <Select label="Unit" size="small" native disabled {...field}>
                    {unit.rows.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="gameType"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel size="small">Lesson List</InputLabel>
                  <Select
                    label="Lesson list"
                    size="small"
                    native
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const selectedValue = e.target.value as string;
                      navigate(`/gms/${selectedValue.toLowerCase().replaceAll("_", "-")}`);
                    }}
                  >
                    {Object.entries(GAME_TYPE).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={8} {...midProps}>
        <Box
          sx={{
            border: `solid 3px ${blueGrey[300]}`,
            borderRadius: "4px",
            boxSizing: "border-box",
            p: 1,
            height: "100%",
          }}
        >
          {children}
        </Box>
      </Grid>
      <Grid item xs={2} {...rightProps}>
        <Box
          sx={{
            border: `solid 3px ${blueGrey[300]}`,
            borderRadius: "4px",
            boxSizing: "border-box",
            p: 1,
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <FormControl>
                    <InputLabel size="small" shrink>
                      Difficulty
                    </InputLabel>
                    <Select
                      label="Difficulty"
                      size="small"
                      native
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    >
                      {Object.entries(LESSON_DIFFICULTY).map(([key, value]) => (
                        <option key={key} value={value}>
                          {key.toUpperCase()}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button color="primary" variant="contained" onClick={onNew}>
                New
              </Button>
              <Button color="primary" variant="contained" onClick={onLoad}>
                Load
              </Button>
              <Button color="primary" variant="contained" onClick={onSave} disabled={isSaving}>
                Save
              </Button>
              <Button color="success" variant="contained" onClick={onPublish} disabled={isPublising || !id}>
                Publish
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export { EditorScene };
