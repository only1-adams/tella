import { Breadcrumbs, Text } from '@mantine/core';
import React from 'react';
import { useLocation, useMatches } from 'react-router';
import { Link } from 'react-router-dom';

function AppBreadcrumb(props) {
  const location = useLocation();

  const crumbs = location.pathname.split('/').filter((crumb) => crumb !== '');

  //   let matches = useMatches();
  //   let crumbs = matches
  //     // first get rid of any matches that don't have handle and crumb
  //     .filter((match) => Boolean(match.handle?.crumb))
  //     // now map them into an array of elements, passing the loader
  //     // data to each one
  //     .map((match) => match.handle.crumb(match.data));

  //   console.log(crumbs);

  return (
    <div>
      <Breadcrumbs separator="/" sx={{ fontSize: 14 }}>
        <Text component={Link} to={'/'}>
          Home
        </Text>
        {crumbs?.map((e, index) => {
          return (
            <Text key={index} tt={'capitalize'} component={Link} to={`/${e}`}>
              {e}
            </Text>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}

export default AppBreadcrumb;
