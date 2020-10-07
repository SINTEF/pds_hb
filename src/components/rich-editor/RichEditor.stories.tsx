import React from 'react'
import { Story, Meta } from '@storybook/react'
import { RichEditor, RichEditorProps } from '.'

export default {
  title: 'Rich text editor',
  component: RichEditor,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<RichEditorProps> = (args) => <RichEditor {...args} />

export const Standard = Template.bind({})
Standard.parameters = {
  storyshots: { disable: true },
}
Standard.args = {
  onChanged: (value) => value,
  value: `<h1>1 INTRODUCTION</h1>
<h2>

    1.1 Objective and Scope</h2>
<p>The use of relevant failure data is an essential part of any quantitative reliability analysis. It is also one of the most challenging parts and raises several questions concerning the relevance of the data, the assumptions underlying the data and what uncertainties are related to the data.<br>
    In this handbook, data for reliability quantification of safety instrumented systems (SIS) are presented (including data for some non-instrumented safety critical equipment). Efforts have been made to document the presented data thoroughly, both in terms of applied data sources, underlying assumptions, and uncertainties in terms of confidence limits.<br>
    Compared to the 2013 version, the main changes and improvements are:<br>
    • Largely extended data basis, including comprehensive and more recent operational experience.<br>
    • New equipment groups have been added, and more detailed failure rates, differentiating on attributes such as dimension, measuring principle, medium, etc., are given for selected sensors and<br>
    final elements.<br>
    • Updated common cause factors (β values) based on an extensive field study of some 12.000<br>
    maintenance notifications, as described in [3].<br>
    • Updated diagnostic coverage (DC) and random hardware factor (RHF) values based on operational<br>
    experience together with expert judgements.<br>
    • Data dossiers with improved data traceability and a more detailed assessment of failure rate<br>
    uncertainty.<br>
    In addition, a general review and update of the failure rates, equipment boundaries and other relevant information and parameters have been performed.<br>
    This data handbook may also be read in conjunction with the PDS method handbook [2], which provides formulas and background information.</p>
<h2><br>
    1.2 The IEC 61508 and 61511 Standards</h2>
<p>
    The IEC 61508 and IEC 61511 standards, [4] and [5], present requirements to SIS for all relevant lifecycle phases, and have become leading standards for SIS specification, design, implementation, and operation. IEC 61508 is a generic standard common to several industries, whereas IEC 61511 has been developed especially for the process industry. These standards present a unified approach to achieve a rational and consistent technical policy for all SIS. The Norwegian Oil and Gas Association (NOROG) has developed a guideline to support the use of IEC 61508/61511, [6].<br>
    A fundamental concept in both IEC 61508 and IEC 61511 is the notion of risk reduction; the higher the SIL, the higher the risk reduction is required. It is therefore important to apply realistic failure data in the design calculations, since too optimistic failure rates may suggest a higher risk reduction than what is obtainable in operation. In other words, the predicted risk reduction, calculated for a SIF in the design phase, should to the degree possible reflect the actual risk reduction that may be experienced in the operational phase, see also [6].<br>
    This is also emphasized in the last revision of IEC 61511-1 (sub clause 11.9.3) which states that the applied reliability data shall be credible, traceable, documented and justified. It is further stated that the reliability data can be based on existing field feedback on similar devices used in a similar operating environment. It is therefore recommended [6] – whenever available – to use data based on actual historic field experience when performing reliability calculations.</p>`,
}
