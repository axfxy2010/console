import React from 'react';
import moment from 'moment';

import {makeDetailsPage, makeListPage, makeList} from './factory';
import {Cog, navFactory, ResourceCog, ResourceLink, Timestamp} from './utils';
import {SecretsList, withSecretsList} from './secret';

const menuActions = [Cog.factory.Delete];

const Header = () => <div className="row co-m-table-grid__head">
  <div className="col-xs-4">Name</div>
  <div className="col-xs-4">Secrets</div>
  <div className="col-xs-4">Age</div>
</div>;

const ServiceAccountRow = ({obj: serviceaccount}) => {
  const {metadata: {name, namespace, uid, creationTimestamp}, secrets} = serviceaccount;

  return (
    <div className="row co-resource-list__item">
      <div className="col-xs-4">
        <ResourceCog actions={menuActions} kind="serviceaccount" resource={serviceaccount} />
        <ResourceLink kind="serviceaccount" name={name} namespace={namespace} title={uid} />
      </div>
      <div className="col-xs-4">
        {secrets ? secrets.length : 0}
      </div>
      <div className="col-xs-4">
        {moment(creationTimestamp).fromNow()}
      </div>
    </div>
  );
};

const Details = (serviceaccount) => {
  const {metadata: {namespace, creationTimestamp}, secrets} = serviceaccount;
  const filters = {selector: {field: 'metadata.name', values: new Set(_.map(secrets, 'name'))}};

  return (
    <div>
      <div className="co-m-pane__body">
        <div className="row">
          <div className="col-md-6">
            <div className="co-m-pane__body-group">
              <dl>
                <dt>Created At</dt>
                <dd><Timestamp timestamp={creationTimestamp} /></dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div className="co-m-pane__body">
        <div className="row">
          <div className="col-xs-12">
            <h1 className="co-section-title">Secrets</h1>
          </div>
        </div>
        <SecretsList namespace={namespace} filters={filters} />
      </div>
    </div>
  );
};

const pages = [navFactory.details(Details)];
const ServiceAccountsDetailsPage = makeDetailsPage('ServiceAccountsDetailsPage', 'serviceaccount', pages, menuActions);
const ServiceAccountsList = makeList('ServiceAccounts', 'serviceaccount', Header, withSecretsList(ServiceAccountRow));
const ServiceAccountsPage = makeListPage('ServiceAccountsPage', 'serviceaccount', ServiceAccountsList);
export {ServiceAccountsList, ServiceAccountsPage, ServiceAccountsDetailsPage};
