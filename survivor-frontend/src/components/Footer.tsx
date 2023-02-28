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
    </footer>
  );
};

export default Footer;
