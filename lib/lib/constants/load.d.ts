import type findMyWay from 'find-my-way';
import SuperMap from '@thunder04/supermap';
import type { ApplicationCommandController, AutocompleteInteractionController, ComponentInteractionController, ModalSubmitInteractionController } from '@src/controllers';
export declare function loadCommands(publicKey: string, router: findMyWay.Instance<findMyWay.HTTPVersion.V1>, path: string, prefix: string, store: SuperMap<string, ApplicationCommandController>): Promise<void>;
export declare function loadComponents(publicKey: string, router: findMyWay.Instance<findMyWay.HTTPVersion.V1>, path: string, prefix: string, store: SuperMap<string, ComponentInteractionController>): Promise<void>;
export declare function loadModals(publicKey: string, router: findMyWay.Instance<findMyWay.HTTPVersion.V1>, path: string, prefix: string, store: SuperMap<string, ModalSubmitInteractionController>): Promise<void>;
export declare function loadAutocomplete(publicKey: string, router: findMyWay.Instance<findMyWay.HTTPVersion.V1>, path: string, prefix: string, store: SuperMap<string, AutocompleteInteractionController>): Promise<void>;
//# sourceMappingURL=load.d.ts.map