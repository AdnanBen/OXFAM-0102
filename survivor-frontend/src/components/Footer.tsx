import Link from "next/link";
import { Dropdown } from "rsuite";

const Footer = () => {
  return (
    <footer>
      <Dropdown title="Language" size="sm" placement="topStart">
        <Link href="#" locale="en">
          <Dropdown.Item>English</Dropdown.Item>
        </Link>
        <Link href="#" locale="ny">
          <Dropdown.Item>Nyanja (Chichewa)</Dropdown.Item>
        </Link>
      </Dropdown>
      <a href="https://forms.office.com/e/YKExsD7nAA" target="_blank">
        Provide your feedback
      </a>
    </footer>
  );
};

export default Footer;
