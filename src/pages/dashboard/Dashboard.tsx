import { SearchTools } from "../../shared/components/searchTools/SearchTools";
import { LayoutBase } from "../../shared/layouts";
import {
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { IPersons, PersonService } from "../../shared/services/api/cliente";
import { CitiesService } from "../../shared/services/api/cities/CitiesService";

export const Dashboard = () => {
  const [personCount, setPersonCount] = useState<number>();
  const [citiesCount, setCitiesCount] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setIsLoading(true);
    PersonService.getAll("", 1).then((result) => {
      setIsLoading(false);
      if (result instanceof Error) return;
      setPersonCount(result.totalCount);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    CitiesService.getAll("", 1).then((result) => {
      setIsLoading(false);
      if (result instanceof Error) return;
      setCitiesCount(result.count);
    });
  }, []);

  return (
    <LayoutBase title="Dashboard">
      <Box>
        <Grid container spacing={2} gap={1}>
          <Grid
            item
            xs={12}
            sm={5}
            md={5}
            lg={4}
            xl={2}
            gap={2}
            padding={2}
            component={Paper}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant={smDown ? "h4" : mdDown ? "h5" : "h6"}>
              Pessoas
            </Typography>

            <Typography variant={smDown ? "h4" : mdDown ? "h5" : "h6"}>{personCount}</Typography>
          </Grid>
          <Grid
            item
            component={Paper}
            xs={12}
            sm={5}
            md={5}
            lg={4}
            xl={2}
            gap={2}
            padding={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
             <Typography variant={smDown ? "h4" : mdDown ? "h5" : "h6"}>Cidades</Typography>
             <Typography variant={smDown ? "h4" : mdDown ? "h5" : "h6"}>{citiesCount}</Typography>
          </Grid>
        </Grid>
      </Box>
    </LayoutBase>
  );
};
