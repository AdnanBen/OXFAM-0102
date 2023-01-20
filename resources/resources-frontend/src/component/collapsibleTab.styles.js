import styled, { css } from 'styled-components';

export const CollapsibleContent = styled.div`
  height: ${props => (props.$showCollapsibleTab ? '300px' : '0px')};
  overflow: hidden;
  transition: height ease 0.9s;
  background-color: f8f9fa; 
  margin: 0px 30px 10px 30px; 
  border-left: 1px solid grey; 
  border-right: 1px solid grey; 
  border-bottom: 1px solid grey; 
`;

export const CollapsibleHeader = styled.div`
  height: 30px;
  margin: 20px 20px 0px 20px; 
  padding: 15px; 
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  background-color: #ffffff;
`;