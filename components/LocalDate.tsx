'use client';

import { useEffect, useState } from 'react';

type Props = {
  date: number;
};

const LocalDate = ({ date }: Props) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(
      new Date(date).toLocaleString('en-IN', {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    );
  }, [date]);

  return (
    <span suppressHydrationWarning>
      {formattedDate || '--'}
    </span>
  );
};

export default LocalDate;
