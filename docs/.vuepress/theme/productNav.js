import {documentGroups} from "../config-client/documents";

// Products as the product switcher and the home page list them: grouped as in
// documentGroups, a group's overview page first, products with `hideInNav`
// left out, and products without a known group in a last "More" group.
export const productGroups = (documents) => {
  const listed = documents.filter(item => !item.hideInNav)
  const known = new Set(documentGroups.map(group => group.id))
  return [
    ...documentGroups.map(({overview, ...group}) => ({
      ...group,
      items: [
        ...(overview ? [{...overview, group: group.id}] : []),
        ...listed.filter(item => item.group === group.id),
      ],
    })),
    {id: 'other', title: 'More', items: listed.filter(item => !known.has(item.group))},
  ].filter(group => group.items.length)
}

// The listed entry whose section ("/eportal/") holds `path`, or null.
export const findCurrentProduct = (documents, path) =>
  productGroups(documents)
    .flatMap(group => group.items)
    .find(item => item.link && path.startsWith(item.link)) || null
