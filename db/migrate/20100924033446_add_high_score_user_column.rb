class AddHighScoreUserColumn < ActiveRecord::Migration
  def self.up
    add_column :users, :high_score, :integer, :default => 0
  end

  def self.down
    remove_column :users, :high_score
  end
end
