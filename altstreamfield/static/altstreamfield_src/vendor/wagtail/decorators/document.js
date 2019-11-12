import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../icon';

import TooltipEntity from './tooltipentity';

import { STRINGS } from '../wagtailconfig';

const documentIcon = <Icon name="doc-full" />;
const missingDocumentIcon = <Icon name="warning" />;

const Document = props => {
  const { entityKey, contentState } = props;
  const data = contentState.getEntity(entityKey).getData();
  const url = data.url || null;
  let icon;
  let label;

  if (!url) {
    icon = missingDocumentIcon;
    label = STRINGS.MISSING_DOCUMENT;
  } else {
    icon = documentIcon;
    label = data.filename || '';
  }

  return (
    <TooltipEntity
      {...props}
      icon={icon}
      label={label}
      url={url}
    />
  );
};

Document.propTypes = {
  entityKey: PropTypes.string.isRequired,
  contentState: PropTypes.object.isRequired,
};

export default Document;