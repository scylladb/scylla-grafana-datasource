import { ContextMenuItem } from '../components/ContextMenu/ContextMenu';
import { LinkModel } from '@grafana/data';
/**
 * Delays creating links until we need to open the ContextMenu
 */
export declare const linkModelToContextMenuItems: (links: () => LinkModel[]) => ContextMenuItem[];
