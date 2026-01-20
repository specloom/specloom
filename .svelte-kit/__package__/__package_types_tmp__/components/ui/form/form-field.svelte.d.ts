import type { FormPath } from "sveltekit-superforms";
declare function $$render<T extends Record<string, unknown>, U extends FormPath<T>>(): {
    props: any;
    exports: {};
    bindings: "ref";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T extends Record<string, unknown>, U extends FormPath<T>> {
    props(): ReturnType<typeof $$render<T, U>>['props'];
    events(): ReturnType<typeof $$render<T, U>>['events'];
    slots(): ReturnType<typeof $$render<T, U>>['slots'];
    bindings(): "ref";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T extends Record<string, unknown>, U extends FormPath<T>>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T, U>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T, U>['props']>, ReturnType<__sveltets_Render<T, U>['events']>, ReturnType<__sveltets_Render<T, U>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T, U>['bindings']>;
    } & ReturnType<__sveltets_Render<T, U>['exports']>;
    <T extends Record<string, unknown>, U extends FormPath<T>>(internal: unknown, props: ReturnType<__sveltets_Render<T, U>['props']> & {}): ReturnType<__sveltets_Render<T, U>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any, any>['bindings']>;
}
declare const FormField: $$IsomorphicComponent;
type FormField<T extends Record<string, unknown>, U extends FormPath<T>> = InstanceType<typeof FormField<T, U>>;
export default FormField;
//# sourceMappingURL=form-field.svelte.d.ts.map