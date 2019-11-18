// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUser from '../../../app/controller/user';
import ExportWxapp from '../../../app/controller/wxapp';

declare module 'egg' {
  interface IController {
    user: ExportUser;
    wxapp: ExportWxapp;
  }
}
