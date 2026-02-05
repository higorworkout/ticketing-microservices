// hoc/withCurrentUser.tsx
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import React from 'react';
import buildClient from '../api/build-client';

type WithCurrentUserProps = {
  currentUser: any; // substitua por um tipo mais específico se souber a estrutura (ex: { id: string; email: string; }).
};

const withCurrentUser = <P extends object>(
  WrappedComponent: NextPage<P & WithCurrentUserProps>
): NextPage<P> => {
  const Wrapper: NextPage<P & WithCurrentUserProps> = (props) => {
    return <WrappedComponent {...(props as P & WithCurrentUserProps)} />;
  };

  Wrapper.getServerSideProps = async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P & WithCurrentUserProps>> => {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');

    let wrappedProps: P = {} as P;

    if (WrappedComponent.getServerSideProps) {
      const result = await WrappedComponent.getServerSideProps(context);
      if ('props' in result) {
        wrappedProps = result.props as P;
      }
    }

    return {
      props: {
        ...wrappedProps,
        currentUser: data.currentUser || null,
      },
    };
  };

  return Wrapper;
};

export default withCurrentUser;