import type { GriffelStyle } from '@griffel/react';
import { makeStyles, mergeClasses } from '@griffel/react';

type VariantDefinitions = Record<string, GriffelStyle>;
type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;
type VariantGroups = Record<string, VariantDefinitions>;
type VariantSelection<V extends VariantGroups> = {
  [VariantGroup in keyof V]?: BooleanMap<keyof V[VariantGroup]> | undefined;
};
type CompoundVariant<V extends VariantGroups> = {
  variants: VariantSelection<V>;
  style: GriffelStyle;
};
type VariantOptions<V extends VariantGroups> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof V]?: V[K] extends Record<infer T, any> ? BooleanMap<T> : never;
};

type VariantStyles<V extends VariantGroups> = {
  base?: GriffelStyle;
  variants: V;
  compoundVariants?: Array<CompoundVariant<V>>;
  defaultVariants?: Partial<VariantOptions<V>>;
};

type VariantStylesFunction<V extends VariantGroups> = () => (
  options?: VariantOptions<V>
) => string;

export type VariantProps<T> = T extends VariantStylesFunction<infer V>
  ? VariantOptions<V>
  : never;

/**
 * Generates a variant class name by combining the variant name and variant value.
 *
 * @template V - The type representing the variant groups.
 * @param variantName - The name of the variant.
 * @param variantValue - The value of the variant.
 * @returns A string representing the combined variant class name.
 */
const generateVariantClass = <V extends VariantGroups>(
  variantName: keyof V,
  variantValue: keyof V[keyof V]
) => {
  return [variantName, variantValue].join('_');
};

/**
 * Generates a compound class name by sorting and joining the values of the provided variant selection.
 *
 * @template V - The type of the variant groups.
 * @param variants - An object representing the selected variants.
 * @returns A string that is a compound class name formed by sorting and joining the variant values with an underscore.
 */
const generateCompoundVariantsClass = <V extends VariantGroups>(
  variants: VariantSelection<V>
) => {
  return Object.values(variants).sort().join('_');
};

/**
 * Returns true if the given variants match the given options
 *
 * @param variants - The variants to check
 * @param options - The options to check
 * @returns
 */
function doVariantsMatch<V extends VariantGroups>(
  variantSelection: VariantSelection<V>,
  variantOptions: VariantOptions<V>
) {
  for (const [variantName, variantValue] of Object.entries(variantSelection)) {
    if (variantValue !== variantOptions[variantName]) {
      return false;
    }
  }
  return true;
}

/**
 * Creates a hook that merges variant styles based on the given options.
 *
 * @param config - The variant styles configuration
 */
export const makeVariantStyles = <V extends VariantGroups>({
  base = {},
  variants,
  compoundVariants = [],
  defaultVariants = {},
}: VariantStyles<V>): VariantStylesFunction<V> => {
  const stylesMap: VariantDefinitions = { base };

  // Add variant styles to styles object
  for (const [variantName, variantValues] of Object.entries(variants)) {
    for (const [variantValue, style] of Object.entries(variantValues)) {
      stylesMap[`${variantName}_${variantValue}`] = style;
    }
  }

  // Add compound variant styles to styles object
  for (const compoundVariant of compoundVariants) {
    const key = generateCompoundVariantsClass(compoundVariant.variants);
    stylesMap[key] = compoundVariant.style;
  }

  // Create styles hook
  const useStyles = makeStyles(stylesMap);

  return function useVariantStyles() {
    const styles = useStyles();

    /**
     * Merges the variant styles based on the given options.
     *
     * @param options - The options to merge the variant styles for
     */
    return function mergeVariantStyles(options: VariantOptions<V> = {}) {
      const optionsWithDefaults: VariantOptions<V> = {
        ...defaultVariants,
        ...options,
      };

      const classNames = [styles.base];

      // Add variant styles
      for (const [variantName, variantValue] of Object.entries(
        optionsWithDefaults
      )) {
        const className = generateVariantClass(variantName, variantValue);

        if (styles[className]) {
          classNames.push(styles[className]);
        }
      }

      // Add compound variant styles
      for (const compoundVariant of compoundVariants) {
        if (doVariantsMatch(compoundVariant.variants, optionsWithDefaults)) {
          classNames.push(
            styles[generateCompoundVariantsClass(compoundVariant.variants)]
          );
        }
      }

      return mergeClasses(...classNames);
    };
  };
};
