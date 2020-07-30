import React from 'react';
import { GrafanaThemeType } from '@grafana/data';
import { RenderFunction } from '../../types';
declare type SassThemeChangeHandler = (theme: GrafanaThemeType) => void;
export declare const renderComponentWithTheme: (component: React.ComponentType<any>, props: any) => JSX.Element;
export declare const withTheme: (handleSassThemeChange: SassThemeChangeHandler) => (story: RenderFunction) => JSX.Element;
export {};
