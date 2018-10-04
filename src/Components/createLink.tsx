import * as React from 'react';
import {Link, LinkProps} from 'react-router-dom';

export const createLink = (path: string) => (props: LinkProps) => <Link to={path} {...props} />;